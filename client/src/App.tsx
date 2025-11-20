import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Schemes from "@/pages/Schemes";
import SchemeDetails from "@/pages/SchemeDetails";
import Contact from "@/pages/Contact";
import About from "@/pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/schemes" component={Schemes} />
      <Route path="/scheme/:id" component={SchemeDetails} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
