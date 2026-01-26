import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowManager } from './WindowManagerContext';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  className?: string;
  appId: string;
}

export function Window({ id, title, children, initialPosition, className, appId }: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, windows, activeWindowId } = useWindowManager();
  const windowState = windows.find(w => w.id === id);
  const isActive = activeWindowId === id;
  const nodeRef = useRef(null);

  if (!windowState || !windowState.isOpen) return null;

  return (
    <AnimatePresence>
      {!windowState.isMinimized && (
        <Draggable
          handle=".window-handle"
          defaultPosition={initialPosition || { x: 50, y: 50 }}
          onStart={() => focusWindow(id)}
          nodeRef={nodeRef}
          bounds="parent"
        >
          <div 
            ref={nodeRef}
            className={cn(
              "absolute flex flex-col rounded-lg overflow-hidden shadow-2xl transition-shadow duration-200 border border-white/10",
              isActive ? "shadow-[0_0_30px_rgba(0,0,0,0.5)] border-primary/30" : "shadow-lg border-white/5",
              "bg-[#09090b]/95 backdrop-blur-md w-[600px] h-[400px]",
              className
            )}
            style={{ zIndex: windowState.zIndex }}
            onClick={() => focusWindow(id)}
          >
            {/* Title Bar */}
            <div 
              className={cn(
                "window-handle h-9 flex items-center justify-between px-3 select-none cursor-default",
                isActive ? "bg-gradient-to-r from-secondary to-background" : "bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", isActive ? "bg-primary animate-pulse" : "bg-muted-foreground")} />
                <span className="text-xs font-mono font-medium text-muted-foreground/80 tracking-wider uppercase">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Minus className="w-3 h-3 text-muted-foreground" />
                </button>
                <button 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Square className="w-3 h-3 text-muted-foreground" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); closeWindow(id); }} 
                  className="p-1 hover:bg-destructive hover:text-white rounded transition-colors group"
                >
                  <X className="w-3 h-3 text-muted-foreground group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto relative">
              {children}
            </div>
            
            {/* Status Bar (optional, can be passed as child, but generic footer looks cool) */}
            <div className="h-6 bg-black/40 border-t border-white/5 flex items-center px-3 justify-end gap-2 text-[10px] text-muted-foreground font-mono">
              <span>PID: {Math.floor(Math.random() * 9000) + 1000}</span>
              <span>MEM: {Math.floor(Math.random() * 50) + 10}MB</span>
            </div>
          </div>
        </Draggable>
      )}
    </AnimatePresence>
  );
}
