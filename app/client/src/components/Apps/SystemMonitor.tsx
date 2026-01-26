import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  cpu: Math.floor(Math.random() * 40) + 10,
  ram: Math.floor(Math.random() * 30) + 40,
}));

export function SystemMonitor() {
  return (
    <div className="h-full bg-black/90 p-4 flex flex-col gap-6 overflow-y-auto">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Architecture</div>
          <div className="text-xl font-bold text-primary">x86_64</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Kernel</div>
          <div className="text-xl font-bold text-purple-400">GeminiOS 1.0</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Uptime</div>
          <div className="text-xl font-bold text-green-400">00:42:15</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Processes</div>
          <div className="text-xl font-bold text-blue-400">142</div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-sm font-mono text-primary mb-2">CPU History</h3>
        <div className="flex-1 w-full bg-black/40 rounded-lg border border-white/5 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="var(--primary)" 
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-sm font-mono text-purple-400 mb-2">Memory Usage</h3>
        <div className="flex-1 w-full bg-black/40 rounded-lg border border-white/5 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
              />
              <Line 
                type="step" 
                dataKey="ram" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
