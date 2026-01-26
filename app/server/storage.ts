
import { db } from "./db";
import {
  files, settings,
  type InsertFile,
  type InsertSettings,
  type File,
  type Settings,
  type UpdateFileRequest
} from "@shared/schema";
import { eq, isNull } from "drizzle-orm";

export interface IStorage {
  // Files
  getFiles(parentId?: number): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, updates: UpdateFileRequest): Promise<File>;
  deleteFile(id: number): Promise<void>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(updates: Partial<InsertSettings>): Promise<Settings>;
  
  // Seeding helper
  hasFiles(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getFiles(parentId?: number): Promise<File[]> {
    if (parentId === undefined) {
      // Get root files (parentId is null)
      return await db.select().from(files).where(isNull(files.parentId));
    }
    return await db.select().from(files).where(eq(files.parentId, parentId));
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async updateFile(id: number, updates: UpdateFileRequest): Promise<File> {
    const [updated] = await db.update(files)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return updated;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  async getSettings(): Promise<Settings> {
    const [setting] = await db.select().from(settings).limit(1);
    if (!setting) {
      // Create default settings if none exist
      const [newSetting] = await db.insert(settings).values({}).returning();
      return newSetting;
    }
    return setting;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<Settings> {
    const current = await this.getSettings();
    const [updated] = await db.update(settings)
      .set(updates)
      .where(eq(settings.id, current.id))
      .returning();
    return updated;
  }

  async hasFiles(): Promise<boolean> {
    const [file] = await db.select().from(files).limit(1);
    return !!file;
  }
}

export const storage = new DatabaseStorage();
