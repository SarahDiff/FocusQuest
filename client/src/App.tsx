import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { FQProvider, useFQ } from "./lib/fq-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/components/nav-bar";
import FQBackground from "@/components/fq-background";
import Onboarding from "@/pages/onboarding";
import Home from "@/pages/home";
import Session from "@/pages/session";
import Skills from "@/pages/skills";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

const SESSION_ROUTES = ["/session", "/session/complete"];
const NAV_ROUTES = ["/", "/home", "/skills", "/history", "/profile"];

function AppInner() {
  const { state } = useFQ();
  const [location] = useLocation();

  const isSessionRoute = SESSION_ROUTES.some(r => location.startsWith(r));
  const showNav = !isSessionRoute && state.onboardingComplete;

  if (!state.onboardingComplete) {
    return (
      <div className="min-h-screen relative">
        <FQBackground />
        <Onboarding />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <FQBackground />
      <div className="relative z-10 flex flex-col h-screen max-w-[430px] mx-auto">
        <main className={`flex-1 overflow-y-auto fq-scroll ${showNav ? 'pb-20' : ''}`}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/session" component={Session} />
            <Route path="/skills" component={Skills} />
            <Route path="/history" component={History} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
        {showNav && <NavBar />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FQProvider>
          <AppInner />
          <Toaster />
        </FQProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
