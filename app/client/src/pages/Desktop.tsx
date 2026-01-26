import React from 'react';
import { WindowManagerProvider, useWindowManager } from '@/components/Desktop/WindowManagerContext';
import { Taskbar } from '@/components/Desktop/Taskbar';
import { Window } from '@/components/Desktop/Window';
import { DesktopIcon } from '@/components/Desktop/DesktopIcon';
import { Terminal, FolderOpen, FileText, Cpu, Trash2, Globe, Bot, Settings } from 'lucide-react';
import { Terminal as TerminalApp } from '@/components/Apps/Terminal';
import { FileManager } from '@/components/Apps/FileManager';
import { DocViewer } from '@/components/Apps/DocViewer';
import { SystemMonitor } from '@/components/Apps/SystemMonitor';
import { Chrome } from '@/components/Apps/Chrome';
import { CodeAIAgent } from '@/components/Apps/CodeAIAgent';
import { Settings as SettingsApp } from '@/components/Apps/Settings';

function DesktopContent() {
  const { openWindow, windows } = useWindowManager();

  // Handle keyboard shortcuts (Optional but cool)
  // ...

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative bg-cover bg-center select-none"
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')` }}
    >
      {/* Overlay for darker theme */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0" />
      
      {/* Scanlines Effect */}
      <div className="scanlines absolute inset-0 pointer-events-none z-50 opacity-20" />

      {/* Desktop Area */}
      <div className="flex-1 relative z-10 p-4 grid grid-cols-1 gap-2 content-start w-min">
        <DesktopIcon 
          label="CodeAI Agent" 
          icon={<Bot className="w-10 h-10 text-blue-400" />} 
          onDoubleClick={() => openWindow('codeai', 'CodeAI Agent')} 
        />
        <DesktopIcon 
          label="Terminal" 
          icon={<Terminal className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('terminal', 'Terminal')} 
        />
        <DesktopIcon 
          label="Chrome" 
          icon={<Globe className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('chrome', 'Chrome')} 
        />
        <DesktopIcon 
          label="My Files" 
          icon={<FolderOpen className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('files', 'File Manager')} 
        />
        <DesktopIcon 
          label="System Docs" 
          icon={<FileText className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('docs', 'Documentation')} 
        />
        <DesktopIcon 
          label="Monitor" 
          icon={<Cpu className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('monitor', 'System Monitor')} 
        />
        <DesktopIcon 
          label="Trash" 
          icon={<Trash2 className="w-10 h-10" />} 
          onDoubleClick={() => {}} 
        />
        <DesktopIcon 
          label="Settings" 
          icon={<Settings className="w-10 h-10" />} 
          onDoubleClick={() => openWindow('settings', 'Settings')} 
        />
      </div>

      {/* Windows Layer */}
      {windows.map(w => (
        <Window 
          key={w.id} 
          id={w.id} 
          title={w.title} 
          appId={w.appId} 
          initialPosition={w.initialPosition}
          className={w.appId === 'terminal' ? 'bg-[#0c0c0c]/95' : w.appId === 'codeai' ? 'bg-slate-950' : ''}
        >
          {w.appId === 'terminal' && <TerminalApp />}
          {w.appId === 'chrome' && <Chrome />}
          {w.appId === 'files' && <FileManager />}
          {w.appId === 'docs' && <DocViewer />}
          {w.appId === 'monitor' && <SystemMonitor />}
          {w.appId === 'codeai' && <CodeAIAgent />}
          {w.appId === 'settings' && <SettingsApp />}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}

export default function Desktop() {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  );
}
