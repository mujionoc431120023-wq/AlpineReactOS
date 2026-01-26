
import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === Virtual File System ===
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'file' | 'directory'
  content: text("content"), // For text files
  parentId: integer("parent_id"), // null for root
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  path: text("path").notNull(), // Helper for breadcrumbs
});

export const insertFileSchema = createInsertSchema(files).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// === System Settings / State ===
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").default("dark"), // 'light' | 'dark' | 'gemini'
  architecture: text("architecture").default("x86_64"), // 'x86_64' | 'arm64' | 'riscv64'
  wallpaper: text("wallpaper").default("default"),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// === API Types ===
export type CreateFileRequest = InsertFile;
export type UpdateFileRequest = Partial<InsertFile>;
export type FileResponse = File;
export type FileTreeResponse = File & { children?: FileTreeResponse[] };

export type CommandRequest = {
  command: string;
  args: string[];
  cwd: string;
};

export type CommandResponse = {
  output: string;
  error?: string;
  exitCode: number;
  newCwd?: string;
};

// === Chat Conversations and Messages ===
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(), // 'user' | 'assistant' | 'model'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true, 
  createdAt: true 
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
