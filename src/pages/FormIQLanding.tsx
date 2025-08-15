import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, Zap, Shield, Factory, Users, Brain, Sparkles } from "lucide-react";

const FormIQLanding = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-600 to-blue-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            FormIQ – The Intelligence Behind FormVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto">
            AI-powered validation, pricing, and compatibility checks connecting creators with OEMs
          </p>
          <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white">
            <Link to="/formiq-details" className="flex items-center gap-2">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Animated Marketplace Graphic */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">A Two-Sided Marketplace That Works For Everyone</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              FormIQ is the brain of FormVerse — validating and optimizing designs from creators, and delivering OEMs ready-to-print files instantly. Both sides win.
            </p>
          </div>

          {/* Animated Flow Diagram */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Creators Node */}
              <div className="text-center">
                <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Users className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-transparent animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creators</h3>
                <p className="text-muted-foreground">Upload & Monetize</p>
              </div>

              {/* FormIQ Brain Node - Center */}
              <div className="text-center relative">
                <div className="relative mx-auto w-40 h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Brain className="w-20 h-20 text-white" />
                  <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/30"></div>
                  <div className="absolute inset-2 rounded-full animate-pulse bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">FormIQ Validation</h3>
                <p className="text-muted-foreground">AI-Powered Intelligence</p>
                
                {/* Connecting Lines */}
                <div className="hidden md:block absolute top-1/2 -left-20 w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 transform -translate-y-1/2">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-20 w-16 h-1 bg-gradient-to-r from-blue-400 to-green-400 transform -translate-y-1/2">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 animate-pulse"></div>
                </div>
              </div>

              {/* OEMs Node */}
              <div className="text-center">
                <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Factory className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-transparent animate-pulse delay-500"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">OEMs</h3>
                <p className="text-muted-foreground">Instant Production</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* For Creators */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">For Creators</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-lg">Monetize your CAD designs instantly</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-lg">AI-powered printability and pricing recommendations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-lg">Protect IP with blockchain-based licensing</p>
                </div>
              </div>
            </div>

            {/* For OEMs */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">For OEMs</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-lg">Instant access to production-ready files</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-lg">Reduced validation and rework costs by 65%</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-lg">Guaranteed compatibility with manufacturing systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Future of CAD-to-Factory</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creators and OEMs — both grow faster with FormVerse
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/creator-onboarding">Start as Creator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">Start as OEM</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FormIQLanding;