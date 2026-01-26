import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AppId = 'terminal' | 'files' | 'docs' | 'monitor' | 'settings' | 'chrome' | 'codeai';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appId: AppId, title?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  tileWindows: (mode: 'horizontal' | 'vertical' | 'grid') => void;
  cascadeWindows: () => void;
  minimizeAll: () => void;
  closeAll: () => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  const openWindow = useCallback((appId: AppId, title: string = 'Application') => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId && appId !== 'terminal' && appId !== 'codeai');
      if (existing) {
        setActiveWindowId(existing.id);
        return prev.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w);
      }

      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        appId,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        initialPosition: { x: 50 + (prev.length * 30), y: 50 + (prev.length * 30) },
        size: { width: 800, height: 500 }
      };

      setActiveWindowId(newWindow.id);
      setNextZIndex(z => z + 1);
      return [...prev, newWindow];
    });
  }, [nextZIndex]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w
    ));
  }, []);

  const tileWindows = useCallback((mode: 'horizontal' | 'vertical' | 'grid') => {
    setWindows(prev => {
      const visibleWindows = prev.filter(w => !w.isMinimized);
      if (visibleWindows.length === 0) return prev;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 48;

      return prev.map((w, idx) => {
        if (w.isMinimized) return w;
        const visibleIdx = visibleWindows.findIndex(vw => vw.id === w.id);
        const count = visibleWindows.length;

        let x = 0, y = 0, width = screenWidth, height = screenHeight;

        if (mode === 'horizontal') {
          width = screenWidth / count;
          x = visibleIdx * width;
        } else if (mode === 'vertical') {
          height = screenHeight / count;
          y = visibleIdx * height;
        } else if (mode === 'grid') {
          const cols = Math.ceil(Math.sqrt(count));
          const rows = Math.ceil(count / cols);
          const col = visibleIdx % cols;
          const row = Math.floor(visibleIdx / cols);
          width = screenWidth / cols;
          height = screenHeight / rows;
          x = col * width;
          y = row * height;
        }

        return { ...w, isMaximized: false, initialPosition: { x, y }, size: { width, height } };
      });
    });
  }, []);

  const cascadeWindows = useCallback(() => {
    setWindows(prev => {
      let offset = 0;
      return prev.map(w => {
        if (w.isMinimized) return w;
        const pos = { x: 50 + offset, y: 50 + offset };
        offset += 30;
        return { ...w, isMaximized: false, initialPosition: pos };
      });
    });
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
  }, []);

  const closeAll = useCallback(() => {
    setWindows([]);
    setActiveWindowId(null);
  }, []);

  const focusWindow = (id: string) => {
    setNextZIndex(prev => {
      const newZ = prev + 1;
      setWindows(current => current.map(w => 
        w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
      ));
      return newZ;
    });
    setActiveWindowId(id);
  };

  return (
    <WindowManagerContext.Provider value={{ 
      windows, 
      activeWindowId, 
      openWindow, 
      closeWindow, 
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      tileWindows,
      cascadeWindows,
      minimizeAll,
      closeAll
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return context;
}
