# GeminiOS

## Overview

GeminiOS is a web-based operating system simulation built as a full-stack TypeScript application. It features a desktop environment with draggable windows, a virtual file system, terminal emulation, and system monitoring - all rendered in a cyberpunk-themed UI. The project simulates OS concepts like boot sequences, file management, and command execution within a browser environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: 
  - React Query for server state (API data fetching/caching)
  - React Context for window management (z-index, focus, minimize states)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme (cyan primary, dark mode)
- **Animations**: Framer Motion for window transitions and boot sequence
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful endpoints defined in shared route definitions with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

### Data Layer
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema**: 
  - `files` table: Virtual file system with hierarchical structure (id, name, type, content, parentId, path)
  - `settings` table: System preferences (theme, architecture, wallpaper)
  - `conversations` table: Chat conversation history for CodeAI Agent
  - `messages` table: Individual messages within conversations
- **Migrations**: Managed via drizzle-kit push command

### AI Integration
- **Gemini API**: Uses Replit AI Integrations for Gemini access (no API key required)
- **Streaming Responses**: Real-time streaming chat responses via SSE
- **Image Generation**: Gemini-powered image generation capabilities
- **Auto Title Generation**: Automatically generates conversation titles using AI based on first message

### Webdriver / Input Mode Support
- **Auto-Detection**: Automatically detects touch or mouse input
- **Touch Mode**: Larger touch targets (48px min), visible drag handles, touch-friendly scrolling
- **Mouse Mode**: Hover effects, smaller targets, drag handles visible on hover
- **Settings App**: UI to manually switch between touch and mouse modes

### Alpine Linux Integration
- **Build Script**: `script/build-alpine-iso.sh` prepares GeminiOS for Alpine Linux
- **GRUB Bootloader**: Multi-boot support (Graphical, Console, Touch Mode, Safe Mode)
- **Webdriver Config**: Touch/mouse mode configuration files for kiosk deployment
- **ISO Structure**: Ready for `grub-mkrescue` to create bootable ISO

### Application Features
- **Boot Screen**: Simulated kernel boot sequence with timed log messages
- **Desktop Environment**: Draggable windows with focus management, taskbar, and desktop icons
- **CodeAI Agent**: AI-powered chat assistant using Gemini API with streaming responses, conversation history, and file attachments
- **Terminal**: Command emulation (ls, cd, cat, help, clear, uname, whoami, date)
- **File Manager**: Virtual file system browser with navigation
- **System Monitor**: CPU/RAM charts using Recharts
- **Documentation Viewer**: Markdown rendering with react-markdown
- **Chrome Browser**: Embedded web browser for in-OS web navigation

### Enhanced Multitasking Features
- **Window Tiling**: Horizontal, vertical, and grid tiling modes for window arrangement
- **Cascade Windows**: Organize windows in a cascading layout
- **Maximize/Minimize All**: Quick actions for all windows
- **Multiple Instances**: Terminal and CodeAI Agent support multiple simultaneous instances

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # UI components (Apps/, Desktop/, ui/)
    hooks/        # Custom React hooks (use-fs, use-system)
    pages/        # Route pages (Desktop, BootScreen)
    lib/          # Utilities (queryClient, utils)
server/           # Backend Express server
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared types and schemas
  schema.ts       # Drizzle schema definitions
  routes.ts       # API route type definitions
```

### Build System
- Development: `tsx` for direct TypeScript execution
- Production: Custom build script using esbuild (server) + Vite (client)
- Output: Combined into `dist/` directory with static files in `dist/public/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, requires `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building
- **connect-pg-simple**: Session storage (available but may not be actively used)

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library for window effects
- **react-draggable**: Draggable window functionality
- **recharts**: System monitor charts
- **react-markdown**: Documentation rendering
- **date-fns**: Date/time formatting
- **Radix UI**: Accessible UI primitives (extensive suite of components)

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **drizzle-kit**: Database migration tooling
- **TypeScript**: Type checking across entire codebase