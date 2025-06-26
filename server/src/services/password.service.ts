
import { v4 as uuidv4 } from 'uuid';
import { readStorage, writeStorage } from '../utils/fileStorage.utils';
import { PasswordData, PasswordEntry } from '../types/passwoerd.types';
import { decrypt, deriveKey, encrypt } from '../utils/encryption.utils';


export class PasswordService {
  private storage = readStorage();


  async add(passwordInfo: PasswordEntry) {
    const id = uuidv4();
    const { service, username, password } = passwordInfo;
    if (!service || !username || !password) throw new Error("Missing fields");

    const encryptionKey = deriveKey(id);
    const encrypted = encrypt(password, encryptionKey);

    this.storage[id] = {
      service,
      username,
      passwordKey: encryptionKey.toString("hex"), // optional: to inspect or store
      password: encrypted,
    };

    writeStorage(this.storage);
    return { message: "Password saved" };
  }


  getAll() {
    return Object.entries(this.storage).map(([id, value]) => {
      let decryptedPassword = "decryption failed";

      try {
        decryptedPassword = decrypt(value.password, deriveKey(id));
      } catch (err) {
        console.error(`Decryption failed for ID ${id}:`, (err as Error).message);
      }

      return {
        id,
        ...value,
        password: decryptedPassword,
      };
    });
  }



  getDetail(id: string) {
    const entry = this.storage[id];
    if (!entry) throw new Error("Service not found");

    const key = deriveKey(id); // ← ✅ Same key

    return {
      service: entry.service,
      username: entry.username,
      password: decrypt(entry.password, key),
    };
  }


  update(updatedData: PasswordData) {
    const { id, service: newService, username, password } = updatedData;
    const entry = this.storage[id];
    if (!entry) throw new Error("Service not found by ID");
    if (decrypt(entry.password, deriveKey(id)) !== password) {
      const encryptedPwd = encrypt(password, deriveKey(id));
      entry.password = password;
    }

    const encryptedPwd = encrypt(password, deriveKey(id));
    entry.password = encryptedPwd;
    entry.service = newService || entry.service;
    entry.username = username || entry.username;

    this.storage[id] = entry;
    writeStorage(this.storage);

    return { message: "Password updated" };
  }


  // updatePassowrd({ service, oldPassword, newPassword }: PasswordRequest) {
  //   const entry = this.storage[service];
  //   if (!entry) throw new Error("Service not found");

  //   if (decrypt(entry.password, this.encryptionKey) !== oldPassword)
  //     throw new Error("Old password incorrect");

  //   entry.password = encrypt(newPassword!, this.encryptionKey);
  //   writeStorage(this.storage);
  //   return { message: "Password updated" };
  //  }
  // updatePassowrd({ service, oldPassword, newPassword, username }: PasswordRequest) {
  //   const entry = Object.values(this.storage).find(e => e.service === service && e.username === username);
  //   if (!entry) throw new Error("Service not found");

  //   const key = deriveKey(entry.username);
  //   const currentPassword = decrypt(entry.password, key);
  //   if (currentPassword !== oldPassword) throw new Error("Old password incorrect");

  //   entry.password = encrypt(newPassword!, key);
  //   writeStorage(this.storage);
  //   return { message: "Password updated" };
  // }

  async delete(id: string) {
    if (!this.storage[id]) throw new Error("Service not found");

    delete this.storage[id];
    writeStorage(this.storage);
  }

}
