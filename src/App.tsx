
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Discover from "./pages/Discover";
import Dashboard from "./pages/Dashboard";
import FormIQ from "./pages/FormIQ";
import Creators from "./pages/Creators";
import CreatorProfile from "./pages/CreatorProfile";
import BuyerInterface from "./pages/BuyerInterface";
import ModelDetails from "./pages/ModelDetails";
import TestDownload from "./pages/TestDownload";
import TestImageToCAD from "./pages/TestImageToCAD";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import PrintabilityReport from "./pages/PrintabilityReport";
import VersionHistory from "./pages/VersionHistory";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ImageToCAD from "./pages/ImageToCAD";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loading for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner during initial load
  if (isLoading) {
    return <LoadingSpinner duration={3000} />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/formiq" element={<FormIQ />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/creator/:id" element={<CreatorProfile />} />
                <Route path="/buyer/:id" element={<BuyerInterface />} />
                <Route path="/model/:id" element={<ModelDetails />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/printability/:id" element={<PrintabilityReport />} />
                <Route path="/version-history/:id" element={<VersionHistory />} />
                <Route path="/image-to-cad" element={<ImageToCAD />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/test-download" element={<TestDownload />} />
                <Route path="/test-image-to-cad" element={<TestImageToCAD />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
