
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Chat and Image AI Routes ===
  registerChatRoutes(app);
  registerImageRoutes(app);
  
  // === File System Routes ===
  
  app.get(api.fs.list.path, async (req, res) => {
    const files = await storage.getFiles();
    res.json(files);
  });

  app.post(api.fs.create.path, async (req, res) => {
    try {
      const input = api.fs.create.input.parse(req.body);
      const file = await storage.createFile(input);
      res.status(201).json(file);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.fs.getContent.path, async (req, res) => {
    const id = Number(req.params.id);
    const file = await storage.getFile(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json({ content: file.content || "" });
  });

  // === System Routes ===

  app.post(api.system.execute.path, async (req, res) => {
    const { command, args, cwd } = req.body;
    let output = "";
    let exitCode = 0;
    let newCwd = cwd;

    switch (command) {
      case "ls":
        const files = await storage.getFiles();
        output = files.map(f => f.type === 'directory' ? f.name + "/" : f.name).join("\n");
        break;
      case "uname":
        if (args.includes("-a")) {
          const settings = await storage.getSettings();
          output = `GeminiOS ${settings.architecture} 1.0.0 PRE-ALPHA (Native Build)`;
        } else {
          output = "GeminiOS";
        }
        break;
      case "cat":
        if (args.length > 0) {
            const allFiles = await storage.getFiles();
            const f = allFiles.find(file => file.name === args[0]);
            if (f && f.content) output = f.content;
            else output = `cat: ${args[0]}: No such file or directory`;
        }
        break;
      case "make":
        output = "CHECKING MULTIBOOT HEADER... OK\nCC kernel/main.c\nCC arch/x86_64/boot.asm\nLD kernel.elf\nSTRIPPING SYMBOLS...\nPREPARING ISODIR...\nMKISOFS geminios.iso\nSUCCESS: release/geminios.iso generated for GRUB/BIOS/UEFI support.";
        break;
      case "help":
        output = "Available commands: ls, cat, uname, clear, help, whoami, make, reboot";
        break;
      case "whoami":
        output = "root";
        break;
      default:
        output = `sh: command not found: ${command}`;
        exitCode = 127;
    }

    res.json({ output, exitCode, newCwd });
  });

  app.get(api.system.settings.get.path, async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.put(api.system.settings.update.path, async (req, res) => {
    const updates = api.system.settings.update.input.parse(req.body);
    const settings = await storage.updateSettings(updates);
    res.json(settings);
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  if (await storage.hasFiles()) return;

  // Root Folders
  const src = await storage.createFile({ name: "src", type: "directory", path: "/src" });
  const docs = await storage.createFile({ name: "Docs", type: "directory", path: "/Docs" });
  const release = await storage.createFile({ name: "release", type: "directory", path: "/release" });
  const boot = await storage.createFile({ name: "boot", type: "directory", path: "/boot" });
  
  // ISO Release
  await storage.createFile({
    name: "geminios.iso",
    type: "file",
    path: "/release/geminios.iso",
    parentId: release.id,
    content: "[BINARY DATA: BOOTABLE ISO IMAGE]"
  });

  // Bootloader / GRUB
  const grub = await storage.createFile({ name: "grub", type: "directory", path: "/boot/grub", parentId: boot.id });
  await storage.createFile({
    name: "grub.cfg",
    type: "file",
    path: "/boot/grub/grub.cfg",
    parentId: grub.id,
    content: `set timeout=5
set default=0

menuentry "GeminiOS (x86_64)" {
    multiboot2 /boot/kernel-x86_64.elf
    boot
}

menuentry "GeminiOS (ARM64)" {
    devicetree /boot/gemini-arm.dtb
    module /boot/kernel-arm64.bin
}

menuentry "GeminiOS (RISC-V)" {
    module /boot/kernel-riscv.bin
}`
  });

  // Kernel Source Structure
  const arch = await storage.createFile({ name: "arch", type: "directory", path: "/src/arch", parentId: src.id });
  const kernel = await storage.createFile({ name: "kernel", type: "directory", path: "/src/kernel", parentId: src.id });
  
  // Multi-Arch Folders
  const x86 = await storage.createFile({ name: "x86_64", type: "directory", path: "/src/arch/x86_64", parentId: arch.id });
  const arm = await storage.createFile({ name: "arm64", type: "directory", path: "/src/arch/arm64", parentId: arch.id });
  const riscv = await storage.createFile({ name: "riscv64", type: "directory", path: "/src/arch/riscv64", parentId: arch.id });

  // x86 Boot
  await storage.createFile({
    name: "boot.asm",
    type: "file",
    path: "/src/arch/x86_64/boot.asm",
    parentId: x86.id,
    content: "section .boottext\n_start:\n    ; x86_64 entry"
  });

  // ARM Boot
  await storage.createFile({
    name: "boot.s",
    type: "file",
    path: "/src/arch/arm64/boot.s",
    parentId: arm.id,
    content: ".section .text\n_start:\n    ; ARM64 entry"
  });

  // RISC-V Boot
  await storage.createFile({
    name: "boot.S",
    type: "file",
    path: "/src/arch/riscv64/boot.S",
    parentId: riscv.id,
    content: ".section .text\n_start:\n    ; RISC-V entry"
  });

  // Build Script
  await storage.createFile({
    name: "Makefile",
    type: "file",
    path: "/src/Makefile",
    parentId: src.id,
    content: `ARCH ?= x86_64\nCC = clang --target=$(ARCH)-unknown-none\nAS = nasm\n\nkernel.iso: kernel.elf\n\tgrub-mkrescue -o release/geminios.iso isodir`
  });
}
