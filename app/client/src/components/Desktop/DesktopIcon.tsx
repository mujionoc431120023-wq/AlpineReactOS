import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

export function DesktopIcon({ label, icon, onDoubleClick }: DesktopIconProps) {
  return (
    <div 
      onDoubleClick={onDoubleClick}
      className="group w-[80px] flex flex-col items-center gap-1 p-2 rounded-md hover:bg-white/10 cursor-pointer border border-transparent hover:border-white/5 active:bg-white/20 transition-all select-none"
    >
      <div className="text-primary/90 group-hover:text-primary drop-shadow-lg transition-colors">
        {icon}
      </div>
      <span className="desktop-icon-label group-hover:bg-primary/20 group-hover:text-primary-foreground transition-colors">
        {label}
      </span>
    </div>
  );
}
