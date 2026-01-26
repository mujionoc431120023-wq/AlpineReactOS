import React, { useState, useEffect, useRef } from 'react';
import { useSystemExecute } from '@/hooks/use-system';
import { Loader2 } from 'lucide-react';

interface HistoryItem {
  command: string;
  output: string;
  id: number;
  cwd: string;
}

export function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 0, command: 'uname -a', output: 'GeminiOS v1.0.0 (x86_64)', cwd: '/root' },
    { id: 1, command: 'help', output: 'Available commands: ls, cd, cat, help, clear, uname, whoami, date', cwd: '/root' }
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/root');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const execute = useSystemExecute();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input when clicked anywhere in terminal
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick); // This might be too aggressive globally, better to attach to container
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      setInput('');
      
      if (!command) return;

      if (command === 'clear') {
        setHistory([]);
        return;
      }

      const args = command.split(' ');
      const cmdName = args.shift() || '';

      // Optimistic update
      const tempId = Date.now();
      
      try {
        const result = await execute.mutateAsync({
          command: cmdName,
          args,
          cwd
        });

        if (result.newCwd) {
          setCwd(result.newCwd);
        }

        setHistory(prev => [...prev, {
          id: tempId,
          command,
          output: result.error || result.output,
          cwd: cwd // The CWD where the command was executed
        }]);
      } catch (err) {
        setHistory(prev => [...prev, {
          id: tempId,
          command,
          output: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          cwd
        }]);
      }
    }
  };

  return (
    <div 
      className="h-full bg-black/90 p-4 font-mono text-sm text-green-500 overflow-y-auto"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="flex gap-2">
            <span className="text-blue-400 font-bold">gemini@os</span>
            <span className="text-white">:</span>
            <span className="text-purple-400">{item.cwd}</span>
            <span className="text-white">$</span>
            <span className="text-gray-100">{item.command}</span>
          </div>
          <div className="whitespace-pre-wrap text-gray-300 ml-4 mt-1 leading-relaxed opacity-90">
            {item.output}
          </div>
        </div>
      ))}
      
      <div className="flex gap-2 items-center">
        <span className="text-blue-400 font-bold">gemini@os</span>
        <span className="text-white">:</span>
        <span className="text-purple-400">{cwd}</span>
        <span className="text-white">$</span>
        <div className="flex-1 relative">
           <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none border-none text-gray-100 placeholder-transparent focus:ring-0 p-0 m-0"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {execute.isPending && (
             <div className="absolute right-0 top-0">
               <Loader2 className="w-4 h-4 animate-spin text-green-500" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
