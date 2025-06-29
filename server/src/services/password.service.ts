
import { passwordConnection } from '../config/typeORM.config';
import { PasswordData, PasswordEntry } from '../types/passwoerd.types';
import { decrypt, deriveKey, encrypt } from '../utils/encryption.utils';
import { Users } from '../models/user.model';
import { Passwords } from '../models/password.models';
import { AppError } from '../utils/response.utils';
import { StatusCodes } from 'http-status-codes';


export class PasswordService {
  protected userRepo = passwordConnection.getRepository(Users);
  protected passwordRepo = passwordConnection.getRepository(Passwords);

  async add(passwordInfo: PasswordData, userId: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new AppError("you are not register yet", StatusCodes.UNAUTHORIZED);
      const masterId = user.masterId
      const { password, username, service } = passwordInfo;
      const encryptionKey = deriveKey(masterId);
      const encrypted = encrypt(password, encryptionKey);
      const newPassword = this.passwordRepo.create({
        service,
        username,
        password: encrypted,
        userId
      })
      await this.passwordRepo.save(newPassword);
    } catch (error) {

    }

  }


  async getAll(userId: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new AppError("user is not found", StatusCodes.UNAUTHORIZED);

      const passwords = await this.passwordRepo.find({
        where: { user: { id: userId } },
        relations: ["user"]
      });

      if (!passwords || passwords.length === 0) return [];

      const decryptedPasswords = passwords.map((entry) => ({
        ...entry,
        password: decrypt(entry.password, deriveKey(user.masterId))
      }));

      return decryptedPasswords;
    } catch (err) {
      console.error(`Decryption failed for ID:`, (err as Error).message);
      throw new AppError("Failed to retrieve and decrypt passwords", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


  async update(updatedData: PasswordData, userId: string) {

    const { id, service: newService, username, password } = updatedData;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("user is not found", StatusCodes.UNAUTHORIZED);

    const passwords = await this.passwordRepo.findOne({ where: { id } });
    if (!user) throw new AppError("service is not found", StatusCodes.UNAUTHORIZED);

    let encryptedPwd = passwords.password;
    if (decrypt(passwords.password, deriveKey(user.masterId)) !== password) {
      encryptedPwd = encrypt(password, deriveKey(user.masterId));
    }

    const newPassword = {
      service: newService,
      username,
      password: encryptedPwd,
      userId
    }
    await this.passwordRepo.update({ id }, { ...newPassword });


    return { message: "Password updated" };
  }


  // // updatePassowrd({ service, oldPassword, newPassword }: PasswordRequest) {
  // //   const entry = this.storage[service];
  // //   if (!entry) throw new Error("Service not found");

  // //   if (decrypt(entry.password, this.encryptionKey) !== oldPassword)
  // //     throw new Error("Old password incorrect");

  // //   entry.password = encrypt(newPassword!, this.encryptionKey);
  // //   writeStorage(this.storage);
  // //   return { message: "Password updated" };
  // //  }
  // // updatePassowrd({ service, oldPassword, newPassword, username }: PasswordRequest) {
  // //   const entry = Object.values(this.storage).find(e => e.service === service && e.username === username);
  // //   if (!entry) throw new Error("Service not found");

  // //   const key = deriveKey(entry.username);
  // //   const currentPassword = decrypt(entry.password, key);
  // //   if (currentPassword !== oldPassword) throw new Error("Old password incorrect");

  // //   entry.password = encrypt(newPassword!, key);
  // //   writeStorage(this.storage);
  // //   return { message: "Password updated" };
  // // }

  async delete(id: string) {
   const passwords = await this.passwordRepo.findOne({ where: { id } });
    if (!passwords) throw new AppError("service is not found", StatusCodes.UNAUTHORIZED);

   await this.passwordRepo.delete(id);
  }

}
