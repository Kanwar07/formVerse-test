import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, Zap, Shield, Factory, Users, Brain, Sparkles, Tag, DollarSign, Check, Search, Camera } from "lucide-react";

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

      {/* Features Deep Dive Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">FormIQ Features - AI-Powered Intelligence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how FormIQ's advanced AI capabilities transform every aspect of your CAD workflow, from design validation to monetization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Auto-Tagging Agent */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto-Tagging Agent</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered tagging that analyzes your model geometry and suggests optimal tags for maximum discoverability.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>96.2% accuracy rate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>50% faster tagging</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>3x more discoverable</span>
                </div>
              </div>
            </div>

            {/* AI Pricing Assistant */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Driven Pricing Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Get smart pricing recommendations based on model complexity, market demand, and historical sales data.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>+24% revenue increase</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Market-aware pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Dynamic adjustments</span>
                </div>
              </div>
            </div>

            {/* Printability Validator */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Printability Validator</h3>
              <p className="text-muted-foreground mb-4">
                Advanced mesh analysis that identifies potential printing issues before they occur and suggests fixes.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>98.7% improvement rate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Real-time analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Instant feedback</span>
                </div>
              </div>
            </div>

            {/* OEM Recommendations */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">OEM-Prompt-Based Recommendations</h3>
              <p className="text-muted-foreground mb-4">
                Connect with manufacturers looking for designs like yours through our semantic matching system.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>412 OEMs connected</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>92% match accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>5-10 potential orders</span>
                </div>
              </div>
            </div>

            {/* Licensing Recommender */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Licensing Recommender</h3>
              <p className="text-muted-foreground mb-4">
                Receive tailored licensing suggestions to maximize your revenue while protecting your intellectual property.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Smart licensing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>IP protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Revenue optimization</span>
                </div>
              </div>
            </div>

            {/* Market Forecasting */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trend & Market Forecasting</h3>
              <p className="text-muted-foreground mb-4">
                Stay ahead with AI predictions about emerging design needs and market opportunities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Market predictions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Trend analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Opportunity alerts</span>
                </div>
              </div>
            </div>

            {/* Image to CAD to 3D Print */}
            <div className="group bg-card rounded-xl p-6 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Image to CAD to 3D Print</h3>
              <p className="text-muted-foreground mb-4">
                Transform 2D images into printable 3D CAD models using advanced AI vision and reconstruction technology.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>95% accuracy rate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>5x faster modeling</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Print-ready output</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">FormIQ Performance Metrics</h3>
              <p className="text-muted-foreground">Real impact across the FormVerse ecosystem</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                <p className="text-sm text-muted-foreground">Models Enhanced</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">₹1.8M+</div>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">87.3%</div>
                <p className="text-sm text-muted-foreground">Printability Success</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">127</div>
                <p className="text-sm text-muted-foreground">OEMs Connected</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/formiq/features">Explore All Features</Link>
            </Button>
          </div>
        </div>
      </section>
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