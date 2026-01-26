import React, { useState } from 'react';
import { useFileSystem } from '@/hooks/use-fs';
import { Folder, FileText, ArrowUp, RefreshCw, HardDrive, AlertCircle } from 'lucide-react';
import { useWindowManager } from '@/components/Desktop/WindowManagerContext';

export function FileManager() {
  const [path, setPath] = useState('/root');
  const { data: files, isLoading, isError, refetch } = useFileSystem(path);
  const { openWindow } = useWindowManager();

  const handleNavigate = (newPath: string) => {
    setPath(newPath);
  };

  const handleUp = () => {
    if (path === '/') return;
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    const newPath = '/' + parts.join('/');
    setPath(newPath || '/');
  };

  const handleOpen = (file: any) => {
    if (file.type === 'directory') {
      const separator = path === '/' ? '' : '/';
      handleNavigate(`${path}${separator}${file.name}`);
    } else {
      // Open file content viewer (generic) - currently we treat docs specially, 
      // but in a real OS we'd pass the file ID to a text editor.
      // For now, let's open a "Notepad" window with the file ID in the title for simplicity
      // or implement a proper TextEditor app. 
      // Re-using DocViewer for simplicity if it matches markdown, otherwise maybe show alert.
      openWindow('docs', file.name);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      {/* Toolbar */}
      <div className="h-10 border-b border-white/10 flex items-center px-2 gap-2 bg-[#2d2d2d]">
        <button onClick={handleUp} disabled={path === '/'} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30">
          <ArrowUp className="w-4 h-4" />
        </button>
        <button onClick={() => refetch()} className="p-1.5 hover:bg-white/10 rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
        <div className="flex-1 bg-black/30 rounded px-2 py-1 text-xs font-mono text-gray-300 border border-white/5 mx-2">
          {path}
        </div>
      </div>

      {/* File Grid */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading...
          </div>
        )}
        
        {isError && (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <AlertCircle className="w-8 h-8 mb-2" />
            <span>Failed to load directory</span>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-4 gap-4">
            {files?.length === 0 && (
              <div className="col-span-4 text-center text-muted-foreground text-sm italic py-10">
                This folder is empty.
              </div>
            )}
            {files?.map((file) => (
              <div 
                key={file.id}
                onDoubleClick={() => handleOpen(file)}
                className="group flex flex-col items-center gap-2 p-2 rounded hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20 transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center text-primary/80 group-hover:text-primary transition-colors">
                  {file.type === 'directory' ? (
                    <Folder className="w-10 h-10 fill-current" />
                  ) : (
                    <FileText className="w-10 h-10" />
                  )}
                </div>
                <span className="text-xs text-center break-all text-gray-300 group-hover:text-white line-clamp-2">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-6 border-t border-white/10 bg-[#2d2d2d] flex items-center px-3 text-[10px] text-gray-400">
        {files?.length || 0} items
      </div>
    </div>
  );
}
