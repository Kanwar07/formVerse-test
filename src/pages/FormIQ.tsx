
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { FormIQFeatureCard } from "@/components/formiq/FormIQFeatureCard";
import { FormIQInsight } from "@/components/formiq/FormIQInsight";
import { 
  ArrowRight,
  Brain,
  Tag,
  DollarSign,
  Key,
  Search,
  Check,
  GitBranch,
  TrendingUp,
  Settings,
  BarChart
} from "lucide-react";

const FormIQ = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoTaggingEnabled, setAutoTaggingEnabled] = useState(true);
  const [pricingAssistantEnabled, setPricingAssistantEnabled] = useState(true);
  const [licensingRecommenderEnabled, setLicensingRecommenderEnabled] = useState(true);
  const [oemRecommendationsEnabled, setOemRecommendationsEnabled] = useState(true);
  const [printabilityValidatorEnabled, setPrintabilityValidatorEnabled] = useState(true);
  const [versionTrackerEnabled, setVersionTrackerEnabled] = useState(true);
  const [marketForecastingEnabled, setMarketForecastingEnabled] = useState(true);
  const [feedbackLoopEnabled, setFeedbackLoopEnabled] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 pt-24">
      <Navbar />
      
      <div className="container py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl border mb-8 bg-muted/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  <Brain className="mr-2 h-4 w-4" />
                  <span>Powered by AI</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Meet <span className="formiq-gradient-text">FormIQ</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  The industry's first AI system built specifically for the 3D design-to-manufacturing pipeline,
                  transforming passive CAD libraries into intelligent, monetizable, and print-ready product workflows.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/formiq/features">
                    <Button>Explore FormIQ Features</Button>
                  </Link>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </div>
              <div className="relative w-full md:w-2/5 aspect-square max-w-xs">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-3/4 h-3/4 rounded-xl bg-gradient-to-br from-[hsl(var(--formiq-blue))] to-[hsl(var(--formiq-purple))] shadow-xl flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Brain className="w-20 h-20 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-muted">
              <div>
                <p className="text-sm text-muted-foreground">Models Enhanced</p>
                <p className="text-2xl font-bold">15,482</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
                <p className="text-2xl font-bold">₹9.2M+</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Printability Improved</p>
                <p className="text-2xl font-bold">98.7%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">OEMs Connected</p>
                <p className="text-2xl font-bold">412</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="mx-auto w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">AI Features</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>FormIQ at a Glance</CardTitle>
                  <CardDescription>
                    How AI is enhancing your designer experience and product performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">AI Enhancement Level</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Models Improved</p>
                        <p className="text-xl font-bold">134</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Revenue Uplift</p>
                        <p className="text-xl font-bold">+24%</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Tag Accuracy</p>
                        <p className="text-xl font-bold">96.2%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What to Design Next?</CardTitle>
                  <CardDescription>AI-powered market insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-3 rounded-md flex items-start space-x-3 bg-muted/30">
                      <span className="text-2xl">🚁</span>
                      <div>
                        <p className="font-medium">Drone Accessories</p>
                        <p className="text-sm text-muted-foreground">Market demand up 32% this month</p>
                      </div>
                    </div>
                    <div className="border p-3 rounded-md flex items-start space-x-3 bg-muted/30">
                      <span className="text-2xl">🏥</span>
                      <div>
                        <p className="font-medium">Medical Jigs</p>
                        <p className="text-sm text-muted-foreground">Highest profit margin category</p>
                      </div>
                    </div>
                    <div className="border p-3 rounded-md flex items-start space-x-3 bg-muted/30">
                      <span className="text-2xl">🔋</span>
                      <div>
                        <p className="font-medium">EV Components</p>
                        <p className="text-sm text-muted-foreground">Growing sector, low competition</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-primary">
                    View Full Market Report
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Recent FormIQ Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormIQInsight 
                title="Pricing Optimization"
                content="Increasing your model price by ₹400 could increase revenue by 15% based on similar models' performance."
                icon={<DollarSign className="h-4 w-4 text-primary" />}
                metrics={[
                  { label: "Current Price", value: "₹2,599" },
                  { label: "Suggested Price", value: "₹2,999" },
                ]}
              />
              
              <FormIQInsight 
                title="Printability Enhancement"
                content="Thickening the walls in highlighted areas could improve printability score by 8 points."
                icon={<Check className="h-4 w-4 text-primary" />}
                metrics={[
                  { label: "Current Score", value: "78/100" },
                  { label: "Potential Score", value: "86/100" },
                ]}
              />
              
              <FormIQInsight 
                title="Tag Recommendations"
                content="Adding 'aerospace' and 'lightweight' tags could increase discoverability by 45%."
                icon={<Tag className="h-4 w-4 text-primary" />}
                metrics={[
                  { label: "Current Views", value: "245/month" },
                  { label: "Projected Views", value: "355/month" },
                ]}
              />
              
              <FormIQInsight 
                title="OEM Matching"
                content="3 new OEMs are looking for models similar to yours in the past week."
                icon={<Search className="h-4 w-4 text-primary" />}
                metrics={[
                  { label: "Matching Score", value: "92%" },
                  { label: "Potential Orders", value: "5-10" },
                ]}
              />
            </div>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormIQFeatureCard
                title="Auto-Tagging Agent"
                description="AI-powered tagging that analyzes your model geometry and suggests optimal tags for maximum discoverability."
                icon={<Tag className="h-5 w-5" />}
                enabled={autoTaggingEnabled}
                onToggle={setAutoTaggingEnabled}
                actionLabel="Configure Tags"
                onAction={() => console.log("Configure tags")}
              />
              
              <FormIQFeatureCard
                title="AI-Driven Pricing Assistant"
                description="Get smart pricing recommendations based on model complexity, market demand, and historical sales data."
                icon={<DollarSign className="h-5 w-5" />}
                enabled={pricingAssistantEnabled}
                onToggle={setPricingAssistantEnabled}
                actionLabel="View Pricing Analytics"
                onAction={() => console.log("View pricing analytics")}
              />
              
              <FormIQFeatureCard
                title="Licensing Recommender"
                description="Receive tailored licensing suggestions to maximize your revenue while protecting your intellectual property."
                icon={<Key className="h-5 w-5" />}
                enabled={licensingRecommenderEnabled}
                onToggle={setLicensingRecommenderEnabled}
                actionLabel="Explore License Options"
                onAction={() => console.log("Explore license options")}
              />
              
              <FormIQFeatureCard
                title="OEM-Prompt-Based Recommendations"
                description="Connect with manufacturers looking for designs like yours through our semantic matching system."
                icon={<Search className="h-5 w-5" />}
                enabled={oemRecommendationsEnabled}
                onToggle={setOemRecommendationsEnabled}
                actionLabel="View Matching OEMs"
                onAction={() => console.log("View matching OEMs")}
              />
              
              <FormIQFeatureCard
                title="Printability Validator"
                description="Advanced mesh analysis that identifies potential printing issues before they occur and suggests fixes."
                icon={<Check className="h-5 w-5" />}
                enabled={printabilityValidatorEnabled}
                onToggle={setPrintabilityValidatorEnabled}
                actionLabel="Run Printability Check"
                onAction={() => console.log("Run printability check")}
              />
              
              <FormIQFeatureCard
                title="Smart Remix + Version Tracker"
                description="Git-style version control for your CAD models with proper attribution for derivatives and remixes."
                icon={<GitBranch className="h-5 w-5" />}
                enabled={versionTrackerEnabled}
                onToggle={setVersionTrackerEnabled}
                actionLabel="View Version History"
                onAction={() => console.log("View version history")}
              />
              
              <FormIQFeatureCard
                title="Trend & Market Forecasting"
                description="Stay ahead with AI predictions about emerging design needs and market opportunities."
                icon={<TrendingUp className="h-5 w-5" />}
                enabled={marketForecastingEnabled}
                onToggle={setMarketForecastingEnabled}
                actionLabel="Explore Market Trends"
                onAction={() => console.log("Explore market trends")}
                beta={true}
              />
              
              <FormIQFeatureCard
                title="Creator Feedback Loop Engine"
                description="FormIQ learns from your preferences and actions to deliver increasingly personalized recommendations."
                icon={<Settings className="h-5 w-5" />}
                enabled={feedbackLoopEnabled}
                onToggle={setFeedbackLoopEnabled}
                actionLabel="Personalize FormIQ"
                onAction={() => console.log("Personalize FormIQ")}
              />
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>FormIQ Performance Report</CardTitle>
                    <CardDescription>
                      Measuring the impact of AI on your design portfolio
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-muted/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm">AI-Influenced Downloads</p>
                          <p className="text-3xl font-bold">68%</p>
                          <p className="text-xs text-emerald-500 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm">Revenue Uplift</p>
                          <p className="text-3xl font-bold">₹18.4K</p>
                          <p className="text-xs text-emerald-500 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +24% from baseline
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm">Avg Printability Score</p>
                          <p className="text-3xl font-bold">84/100</p>
                          <p className="text-xs text-emerald-500 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +8 points improvement
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/5">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm">OEM Match Rate</p>
                          <p className="text-3xl font-bold">76%</p>
                          <p className="text-xs text-emerald-500 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +15% better targeting
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">FormIQ Feature Impact</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Auto-Tagging</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Pricing Assistant</span>
                          <span className="text-sm font-medium">86%</span>
                        </div>
                        <Progress value={86} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Licensing Recommender</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Printability Validator</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Version Tracker</span>
                          <span className="text-sm font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Models with FormIQ suggestions implemented receive 2.4x more downloads</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>AI-suggested pricing has increased your average revenue per model by 32%</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Printability improvements have reduced customer support tickets by 64%</span>
                      </li>
                      <li className="text-sm flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>OEM matching has connected you with 8 new enterprise clients</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <p className="text-sm text-muted-foreground">
                  FormIQ is constantly learning and improving. Your continuous feedback helps train the AI to better serve your specific needs.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>FormIQ Settings & Preferences</CardTitle>
                <CardDescription>
                  Configure how FormIQ analyzes your models and generates recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Learning Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Model Analysis Depth</p>
                          <p className="text-sm text-muted-foreground">
                            Determines how deeply FormIQ analyzes model geometry
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Standard</Button>
                          <Button variant="default" size="sm">Advanced</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Sales Data Collection</p>
                          <p className="text-sm text-muted-foreground">
                            Allow FormIQ to analyze your sales patterns for better recommendations
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Market Trend Analysis</p>
                          <p className="text-sm text-muted-foreground">
                            Enable FormIQ to suggest designs based on market trends
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Remix Attribution</p>
                          <p className="text-sm text-muted-foreground">
                            Track and manage derivative works based on your designs
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Price Optimization Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when FormIQ identifies pricing opportunities
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">OEM Match Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts when manufacturers search for similar models
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Market Trend Reports</p>
                          <p className="text-sm text-muted-foreground">
                            Weekly summaries of emerging design opportunities
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Privacy & Data Sharing</h3>
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <p className="text-sm mb-4">
                        FormIQ uses your model data to provide intelligent recommendations. 
                        Your privacy is important to us - you control what data is shared.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Share anonymized geometry data</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Share sales performance metrics</p>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Allow AI model improvement using my data</p>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button variant="outline" className="mr-2">Reset to Defaults</Button>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Call to Action Section */}
        <div className="mt-10 space-y-6">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Unlock the Full Power of FormIQ</h2>
                  <p className="text-muted-foreground">
                    Apply FormIQ to your existing models and see an immediate improvement in 
                    discoverability, printability, and revenue potential.
                  </p>
                </div>
                <Button className="mt-4 md:mt-0" size="lg">
                  Get Started with FormIQ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SDK Integration Section */}
          <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/30 to-accent/5">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Brain className="mr-2 h-4 w-4" />
                  <span>FormIQ SDK Integration</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Integrate FormIQ Intelligence into Your CAD Platform</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  CAD software companies can now embed FormIQ's AI validation directly into their platforms. 
                  Provide real-time printability analysis, design optimization, and intelligent recommendations 
                  to your users without leaving your environment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant printability checks and design recommendations as users create models
                  </p>
                </div>
                
                <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    RESTful APIs and SDKs for seamless integration into existing CAD workflows
                  </p>
                </div>
                
                <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Enhanced User Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Boost user satisfaction with intelligent design assistance and validation
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.open('https://calendly.com/partner-cadqua3d/30min', '_blank')}
                >
                  Request SDK Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View API Documentation
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-muted/50">
                <p className="text-xs text-center text-muted-foreground">
                  Join leading CAD platforms like SolidWorks, Fusion 360, and Inventor partners in revolutionizing design validation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default FormIQ;
