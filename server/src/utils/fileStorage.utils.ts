import fs from "fs";
import path from "path";
import { PasswordEntry } from "../types/passwoerd.types";

const storagePath = path.join(process.cwd(), "storage.json");

export function readStorage(): Record<string, PasswordEntry> {
  try {
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading storage:", err);
  }
  return {};
}

export function writeStorage(data: Record<string, PasswordEntry>) {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing storage:", err);
    throw err;
  }
}


export let storage: Record<string, { username: string; password: string }> = {};

export function loadStorage() {
  try {
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf8');
      storage = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading storage:", err);
    storage = {};
  }
}
 
export function saveStorage() {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(storage, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving storage:", err);
    throw err;
  }
}
