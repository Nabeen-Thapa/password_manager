import crypto from "crypto";

const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);
const baseSalt = "20"; 


// Generate a 256-bit key from a master password or user ID
export function deriveKey(userSecret: string): Buffer {
  return crypto.pbkdf2Sync(userSecret, baseSalt, 100000, 32, 'sha256');
}

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string, key: Buffer): string {
  const [ivStr, content] = encryptedText.split(":");
  const iv = Buffer.from(ivStr, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
  return decrypted.toString();
}
