import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function BootScreen() {
  const [, setLocation] = useLocation();
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const bootSequence = [
      "Initializing GeminiOS Kernel v1.0.0...",
      "Loading drivers...",
      "Mounting Virtual File System (VFS)...",
      "Starting System Services...",
      "Checking disk integrity... OK",
      "Starting Graphical User Interface...",
      "Welcome to GeminiOS."
    ];

    let delay = 0;
    bootSequence.forEach((log, index) => {
      delay += Math.random() * 500 + 300;
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setLocation('/desktop'), 800);
        }
      }, delay);
    });
  }, [setLocation]);

  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono p-8 flex flex-col justify-end pb-20">
      <div className="max-w-3xl space-y-2">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
            <span>{log}</span>
          </motion.div>
        ))}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-5 bg-green-500 inline-block align-middle ml-2"
        />
      </div>
    </div>
  );
}
