/** Orbital Noir theme shell: this project is a single cinematic observatory route. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import WebShooter from "./components/WebShooter";
import Home from "./pages/Home";

import Intro from "./pages/Intro";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      {/* Fallback to intro */}
      <Route component={Intro} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <WebShooter />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
