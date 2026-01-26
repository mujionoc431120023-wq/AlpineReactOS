import { Settings as SettingsIcon, Monitor, MousePointer, Hand } from "lucide-react";
import { useInputMode } from "@/hooks/use-input-mode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Settings() {
  const { mode, setMode, isTouch, isMouse } = useInputMode();

  return (
    <div className="h-full bg-slate-950 text-slate-200 p-4">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <SettingsIcon className="w-6 h-6 text-cyan-400" />
        <h1 className="text-xl font-semibold">System Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Input Mode (Webdriver)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Select your preferred input method. Auto-detected: {mode}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMode("mouse")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                isMouse
                  ? "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
              )}
            >
              <MousePointer className="w-4 h-4" />
              Mouse Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => setMode("touch")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                isTouch
                  ? "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
              )}
            >
              <Hand className="w-4 h-4" />
              Touch Mode
            </Button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Input Mode Features</h2>
          <div className="space-y-2 text-xs text-slate-500">
            {isMouse ? (
              <>
                <p>• Hover effects enabled</p>
                <p>• Right-click context menus</p>
                <p>• Smaller touch targets</p>
                <p>• Drag handles visible on hover</p>
              </>
            ) : (
              <>
                <p>• Larger touch targets (48px minimum)</p>
                <p>• Long-press for context menus</p>
                <p>• Visible drag handles</p>
                <p>• Touch-friendly scrolling</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-3">System Information</h2>
          <div className="space-y-2 text-xs text-slate-500">
            <p>GeminiOS v1.0.0 (Alpine Linux Base)</p>
            <p>Kernel: Linux 6.6-gemini</p>
            <p>Architecture: x86_64 / ARM64 / RISC-V</p>
          </div>
        </div>
      </div>
    </div>
  );
}
