import { ReactNode } from "react";
import { InputModeContext, useInputModeDetection } from "@/hooks/use-input-mode";

export function InputModeProvider({ children }: { children: ReactNode }) {
  const inputMode = useInputModeDetection();
  
  return (
    <InputModeContext.Provider value={inputMode}>
      {children}
    </InputModeContext.Provider>
  );
}
