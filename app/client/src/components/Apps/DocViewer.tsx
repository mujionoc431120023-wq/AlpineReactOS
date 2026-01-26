import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

const CONTENT = `
# GeminiOS System Architecture

## 1. Abstraction Layer
The GeminiOS abstraction layer provides a unified interface for hardware interaction. It decouples the kernel from specific hardware implementation details, allowing for portability across x86_64, ARM64, and RISC-V architectures.

- **HAL (Hardware Abstraction Layer)**: Handles I/O operations.
- **VFS (Virtual File System)**: Unified file access protocol.

## 2. Compilation Strategy
GeminiOS utilizes a Just-In-Time (JIT) compilation strategy for user-space applications to ensure maximum performance while maintaining security boundaries.

\`\`\`bash
# Example compilation command
gcc -O2 -march=native kernel.c -o vmlinuz
\`\`\`

## 3. Kernel Design
The kernel follows a hybrid design, incorporating features from both monolithic and microkernels.

- **Scheduler**: O(1) preemptive scheduler.
- **Memory Management**: Paging with copy-on-write optimization.
- **IPC**: Fast message passing for inter-process communication.

> "The operating system is the soul of the machine."

### System calls
Standard POSIX-compliant system calls are implemented to ensure compatibility with existing UNIX utilities.
`;

export function DocViewer() {
  return (
    <div className="h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col">
      <div className="border-b border-gray-800 p-2 bg-[#161b22] text-xs text-gray-400 font-mono">
        docs/architecture.md
      </div>
      <ScrollArea className="flex-1 p-8">
        <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-gray-800 font-sans">
          <ReactMarkdown>{CONTENT}</ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}
