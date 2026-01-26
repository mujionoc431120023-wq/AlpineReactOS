import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useWindowManager, AppId } from './WindowManagerContext';
import { Terminal, FolderOpen, Cpu, FileText, Settings, Radio, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const APPS: { id: AppId; icon: React.ReactNode; label: string }[] = [
  { id: 'terminal', icon: <Terminal className="w-5 h-5" />, label: 'Terminal' },
  { id: 'chrome', icon: <Globe className="w-5 h-5" />, label: 'Chrome' },
  { id: 'files', icon: <FolderOpen className="w-5 h-5" />, label: 'Files' },
  { id: 'docs', icon: <FileText className="w-5 h-5" />, label: 'Docs' },
  { id: 'monitor', icon: <Cpu className="w-5 h-5" />, label: 'System' },
];

export function Taskbar() {
  const [time, setTime] = useState(new Date());
  const { openWindow, windows, activeWindowId, minimizeWindow } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Start Menu (Simplified) */}
      <AnimatePresence>
        {startOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setStartOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed bottom-14 left-2 z-50 w-72 bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-4 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-white">GeminiOS</div>
                  <div className="text-xs text-muted-foreground">System Administrator</div>
                </div>
              </div>
              
              <div className="space-y-1">
                {APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      openWindow(app.id, app.label);
                      setStartOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 text-sm text-gray-200 transition-colors"
                  >
                    {app.icon}
                    {app.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between">
                 <button className="p-2 hover:bg-white/10 rounded text-muted-foreground hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                 </button>
                 <button className="px-3 py-1.5 bg-destructive/80 hover:bg-destructive text-white text-xs rounded transition-colors">
                    Shut Down
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bar */}
      <div className="h-12 bg-[#09090b]/80 backdrop-blur-md border-t border-white/5 flex items-center px-2 gap-2 relative z-50">
        
        {/* Start Button */}
        <button 
          onClick={() => setStartOpen(!startOpen)}
          className={cn(
            "p-2 rounded-md transition-all duration-200 group relative overflow-hidden",
            startOpen ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-white"
          )}
        >
          <Radio className={cn("w-6 h-6", startOpen && "animate-pulse")} />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-2" />

        {/* Running Apps */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {windows.map((window) => {
            const app = APPS.find(a => a.id === window.appId) || APPS[0];
            const isActive = activeWindowId === window.id && !window.isMinimized;
            
            return (
              <button
                key={window.id}
                onClick={() => minimizeWindow(window.id)} // This handles focus/restore logic via context
                className={cn(
                  "h-9 px-3 min-w-[120px] max-w-[200px] flex items-center gap-2 rounded text-sm transition-all border",
                  isActive 
                    ? "bg-white/10 border-white/10 text-white shadow-inner" 
                    : "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <span className="opacity-80">{app.icon}</span>
                <span className="truncate">{window.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tray */}
        <div className="flex items-center gap-4 px-4 text-xs font-mono text-gray-400 border-l border-white/10 h-full">
           <div className="flex flex-col items-end leading-none gap-1">
             <span>{format(time, 'HH:mm')}</span>
             <span className="text-[10px] text-gray-500">{format(time, 'MMM d, yyyy')}</span>
           </div>
        </div>
      </div>
    </>
  );
}
