
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import PrintabilityReport from "./pages/PrintabilityReport";
import BuyerInterface from "./pages/BuyerInterface";
import ModelDetails from "./pages/ModelDetails";
import VersionHistory from "./pages/VersionHistory";
import FormIQ from "./pages/FormIQ";
import NotFound from "./pages/NotFound";
import CreatorProfile from "./pages/CreatorProfile";
import Creators from "./pages/Creators";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="formverse-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/printability/:modelId" element={<PrintabilityReport />} />
              <Route path="/discover" element={<BuyerInterface />} />
              <Route path="/model/:modelId" element={<ModelDetails />} />
              <Route path="/model/:modelId/history" element={<VersionHistory />} />
              <Route path="/formiq" element={<FormIQ />} />
              <Route path="/creator/:username" element={<CreatorProfile />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
