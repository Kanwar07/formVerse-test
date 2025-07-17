import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Brain,
  Tag,
  DollarSign,
  Key,
  Search,
  Check,
  GitBranch,
  TrendingUp,
  Settings,
  Zap,
  Target,
  Sparkles,
  Layers,
  BarChart3,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

const FormIQFeatures = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  useEffect(() => {
    // Animate features appearing one by one
    const timer = setTimeout(() => {
      const intervals = [0, 200, 400, 600, 800, 1000, 1200, 1400];
      intervals.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleFeatures(prev => [...prev, index]);
        }, delay);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Tag className="h-8 w-8" />,
      title: "Auto-Tagging Agent",
      description: "AI-powered tagging that analyzes your model geometry and suggests optimal tags for maximum discoverability.",
      color: "from-blue-500 to-blue-600",
      metrics: ["96.2% accuracy", "50% faster tagging", "3x more discoverable"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "AI-Driven Pricing Assistant",
      description: "Get smart pricing recommendations based on model complexity, market demand, and historical sales data.",
      color: "from-green-500 to-green-600",
      metrics: ["+24% revenue", "Market-aware pricing", "Dynamic adjustments"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: "Licensing Recommender",
      description: "Receive tailored licensing suggestions to maximize your revenue while protecting your intellectual property.",
      color: "from-purple-500 to-purple-600",
      metrics: ["Smart licensing", "IP protection", "Revenue optimization"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "OEM-Prompt-Based Recommendations",
      description: "Connect with manufacturers looking for designs like yours through our semantic matching system.",
      color: "from-orange-500 to-orange-600",
      metrics: ["412 OEMs", "92% match accuracy", "5-10 potential orders"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: "Printability Validator",
      description: "Advanced mesh analysis that identifies potential printing issues before they occur and suggests fixes.",
      color: "from-red-500 to-red-600",
      metrics: ["98.7% improvement", "Real-time analysis", "Instant feedback"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Smart Remix + Version Tracker",
      description: "Git-style version control for your CAD models with proper attribution for derivatives and remixes.",
      color: "from-indigo-500 to-indigo-600",
      metrics: ["Version control", "Attribution tracking", "Remix management"],
      animation: "animate-fade-in hover-scale"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Trend & Market Forecasting",
      description: "Stay ahead with AI predictions about emerging design needs and market opportunities.",
      color: "from-pink-500 to-pink-600",
      metrics: ["Market predictions", "Trend analysis", "Opportunity alerts"],
      animation: "animate-fade-in hover-scale",
      beta: true
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Creator Feedback Loop Engine",
      description: "FormIQ learns from your preferences and actions to deliver increasingly personalized recommendations.",
      color: "from-teal-500 to-teal-600",
      metrics: ["Personalized AI", "Learning system", "Adaptive recommendations"],
      animation: "animate-fade-in hover-scale"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/formiq">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to FormIQ
              </Button>
            </Link>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-scale-in">
              <Brain className="mr-2 h-4 w-4" />
              <span>AI-Powered Features</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
              FormIQ Features in <span className="formiq-gradient-text">Motion</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Experience the power of AI-driven design intelligence through interactive demonstrations
              of each FormIQ feature working in real-time.
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm">Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm">Precision Analytics</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm">AI Intelligence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 animate-fade-in">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">15,482</div>
              <p className="text-sm text-muted-foreground">Models Enhanced</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">₹9.2M+</div>
              <p className="text-sm text-muted-foreground">Revenue Generated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">98.7%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">412</div>
              <p className="text-sm text-muted-foreground">OEMs Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden border-2 transition-all duration-500 ${
                visibleFeatures.includes(index) 
                  ? 'opacity-100 translate-y-0 animate-scale-in hover-scale' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]`}>
                    {feature.icon}
                  </div>
                  {feature.beta && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Beta
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-3">
                  {feature.metrics.map((metric, metricIndex) => (
                    <div 
                      key={metricIndex}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in"
                      style={{
                        animationDelay: `${(index * 100) + (metricIndex * 50)}ms`
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]`} />
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  View Live Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your CAD Workflow?</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Experience the full power of FormIQ's AI-driven features and revolutionize 
                how you design, price, and monetize your 3D models.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="animate-scale-in hover-scale">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="animate-scale-in hover-scale">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Pricing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default FormIQFeatures;