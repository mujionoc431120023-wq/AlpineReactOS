import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Chrome() {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = inputUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    setUrl(targetUrl);
    setInputUrl(targetUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#f1f3f4] border-b border-gray-300">
        <div className="flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-white rounded-full px-4 py-1 border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <Globe className="h-3 w-3 text-gray-400 mr-2" />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800"
          />
        </form>
        
        <div className="ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">G</div>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="flex items-center gap-1 font-bold text-6xl">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">e</span>
            <span className="text-yellow-500">m</span>
            <span className="text-blue-500">i</span>
            <span className="text-green-500">n</span>
            <span className="text-red-500">i</span>
          </div>
          
          <div className="w-full max-w-xl flex items-center bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-full px-5 py-3 gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search GeminiOS or type a URL" className="flex-1 outline-none text-lg" />
          </div>

          <div className="flex gap-4">
            <Button variant="secondary" className="bg-[#f8f9fa] border border-transparent hover:border-gray-200">Gemini Search</Button>
            <Button variant="secondary" className="bg-[#f8f9fa] border border-transparent hover:border-gray-200">I'm Feeling Lucky</Button>
          </div>

          <div className="pt-8 text-sm text-gray-600">
            GeminiOS offered in: <span className="text-blue-700 hover:underline cursor-pointer">Bahasa Indonesia</span>
          </div>
        </div>
        
        {/* Real iframe placeholder (not working in sandbox but for visual) */}
        {/* <iframe src={url} className="w-full h-full border-none" title="browser-content" /> */}
      </div>
      
      {/* Footer */}
      <div className="bg-[#f2f2f2] p-3 text-xs text-gray-600 flex justify-between px-8 border-t border-gray-300">
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Advertising</span>
          <span className="hover:underline cursor-pointer">Business</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Settings</span>
        </div>
      </div>
    </div>
  );
}
