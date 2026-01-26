import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InputModeProvider } from "@/components/InputModeProvider";
import NotFound from "@/pages/not-found";
import Desktop from "@/pages/Desktop";
import BootScreen from "@/pages/BootScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BootScreen} />
      <Route path="/desktop" component={Desktop} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <InputModeProvider>
          <Toaster />
          <Router />
        </InputModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
