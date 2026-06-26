import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import Questionnaire from "@/pages/Questionnaire";
import Estimation from "@/pages/Estimation";
import RendezVous from "@/pages/RendezVous";
import Suivi from "@/pages/Suivi";
import NotFound from "@/pages/not-found";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route path="/estimation" component={Estimation} />
      <Route path="/rendez-vous" component={RendezVous} />
      <Route path="/suivi/:token" component={Suivi} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
