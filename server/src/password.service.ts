import { PasswordData, PasswordRequest } from "./types/passwoerd.types";
import { decrypt, encrypt } from "./utils/encryption.utils";
import { readStorage, writeStorage } from "./utils/fileStorage.utils";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

export class PasswordService {
  private storage = readStorage();
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = crypto.randomBytes(32);
  }

  async add(passwordInfo: PasswordRequest) {
    const id = uuidv4();
    console.log("service")
    const { service, username, password } = passwordInfo;
    if (!service || !username || !password) throw new Error("Missing fields");

    this.storage[id] = {
      service,
      username,
      password: encrypt(password, this.encryptionKey),
    };
    writeStorage(this.storage);
    return { message: "Password saved" };
  }


  getAll() {
    return Object.entries(this.storage).map(([id, value]) => ({
      id,
      ...value,
      password: decrypt(value.password, this.encryptionKey)
    }));
  }


  getDetail(id: string) {
    const entry = this.storage[id];
    if (!entry) throw new Error("Service not found");
    return {
      service: entry.service,
      username: entry.username,
      password: decrypt(entry.password, this.encryptionKey),
    };
  }


  ///.........................
update(updatedData: PasswordData) {
  const { id, service: newService, username } = updatedData;
  console.log("update service:", updatedData);

  // Get the old entry directly using the id (which is the key)
  const entry = this.storage[id];
  if (!entry) throw new Error("Service not found by ID");

  const oldService = entry.service;

  // If service name changed, update the service field
  entry.service = newService || oldService;
  entry.username = username || entry.username;

  // Save back to the same id key
  this.storage[id] = entry;

  writeStorage(this.storage);

  return { message: "Password updated" };
}


  updatePassowrd({ service, oldPassword, newPassword }: PasswordRequest) {
    const entry = this.storage[service];
    if (!entry) throw new Error("Service not found");

    if (decrypt(entry.password, this.encryptionKey) !== oldPassword)
      throw new Error("Old password incorrect");

    entry.password = encrypt(newPassword!, this.encryptionKey);
    writeStorage(this.storage);
    return { message: "Password updated" };
  }

  async delete(id: string) {
    const entries = Object.entries(this.storage);
    const entry = entries.find(([_, value]) => value.id === id);
    if (!entry) throw new Error("Service not found");

    const [serviceKey] = entry;
    delete this.storage[serviceKey];
    writeStorage(this.storage);
  }

}
