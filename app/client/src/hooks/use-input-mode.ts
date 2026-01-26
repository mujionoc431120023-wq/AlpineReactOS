import { useState, useEffect, useCallback, createContext, useContext } from "react";

export type InputMode = "mouse" | "touch";

interface InputModeContextType {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  isTouch: boolean;
  isMouse: boolean;
}

const InputModeContext = createContext<InputModeContextType | null>(null);

export function useInputMode() {
  const context = useContext(InputModeContext);
  if (!context) {
    throw new Error("useInputMode must be used within InputModeProvider");
  }
  return context;
}

export function useInputModeDetection() {
  const [mode, setMode] = useState<InputMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("inputMode");
      if (saved === "mouse" || saved === "touch") return saved;
      return window.matchMedia("(pointer: coarse)").matches ? "touch" : "mouse";
    }
    return "mouse";
  });

  useEffect(() => {
    localStorage.setItem("inputMode", mode);
    document.documentElement.setAttribute("data-input-mode", mode);
  }, [mode]);

  useEffect(() => {
    let lastTouchTime = 0;

    const handleTouchStart = () => {
      lastTouchTime = Date.now();
      if (mode !== "touch") setMode("touch");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Date.now() - lastTouchTime > 500 && e.movementX !== 0 && e.movementY !== 0) {
        if (mode !== "mouse") setMode("mouse");
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mode]);

  return {
    mode,
    setMode,
    isTouch: mode === "touch",
    isMouse: mode === "mouse",
  };
}

export { InputModeContext };
