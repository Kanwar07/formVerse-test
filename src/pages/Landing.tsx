
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Code, Database, FileImage, Upload } from "lucide-react";
import { CreatorLeaderboard } from "@/components/CreatorLeaderboard";

const Landing = () => {
  const [activeTab, setActiveTab] = useState("creator");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 -z-10"></div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
        </div>
        
        <div className="container flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
            <span className="text-primary">India's First Launchpad for CAD Creators</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Turn your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CAD</span> into <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">capital</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Upload, auto-tag, price, license, and validate printability of your 3D models using our proprietary AI system FormIQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/dashboard">Start Creating</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/discover">Browse Models</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Hire Creators</Link>
            </Button>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] mt-12">
            <div className="absolute inset-0 mx-auto w-full max-w-5xl">
              <div className="w-full h-full bg-card rounded-xl border shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=4896&ixlib=rb-4.0.3" 
                  alt="High-tech 3D CAD Design Interface" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by FormIQ™ AI</h2>
            <p className="text-muted-foreground">
              Our proprietary AI system that makes creating, validating, and monetizing CAD models seamless and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <FileImage className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Auto-tagging</h3>
                <p className="text-muted-foreground">
                  AI-powered automatic tagging of your 3D models for better discoverability.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Printability Check</h3>
                <p className="text-muted-foreground">
                  Validate your designs with our advanced mesh analysis and receive a readiness score.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Licensing</h3>
                <p className="text-muted-foreground">
                  Intelligent pricing suggestions and flexible licensing options for your models.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Made for Creators and OEMs</h2>
            <p className="text-muted-foreground">
              Whether you're a creator looking to monetize your designs or an OEM seeking quality CAD models.
            </p>
          </div>

          <Tabs defaultValue="creator" className="max-w-4xl mx-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="creator">For Creators</TabsTrigger>
              <TabsTrigger value="oem">For OEMs</TabsTrigger>
            </TabsList>
            <TabsContent value="creator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Monetize Your CAD Designs</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Upload STL, OBJ, and STEP files with ease</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Get AI-powered pricing suggestions</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Validate printability with our mesh analysis</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Track royalties and version history</p>
                    </li>
                  </ul>
                  <Button className="mt-6" asChild>
                    <Link to="/dashboard">Start Creating</Link>
                  </Button>
                </div>
                <div className="bg-card rounded-xl border overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
                    alt="Creator Dashboard" 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h4 className="text-lg font-medium mb-2">Powerful Creator Dashboard</h4>
                    <p className="text-muted-foreground text-sm">Track sales, manage models, and analyze performance in one place.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="oem" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Find Perfect Models for Production</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Discover verified printable CAD models</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Use AI prompt-based or filter-based discovery</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>License models with flexible terms</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p>Access material compatibility information</p>
                    </li>
                  </ul>
                  <Button className="mt-6" asChild>
                    <Link to="/discover">Browse Models</Link>
                  </Button>
                </div>
                <div className="bg-card rounded-xl border overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2420&ixlib=rb-4.0.3" 
                    alt="OEM Buyer Interface" 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h4 className="text-lg font-medium mb-2">Intuitive Buyer Interface</h4>
                    <p className="text-muted-foreground text-sm">Discover the perfect models for your manufacturing needs.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Creator Leaderboard Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Top CAD Creators</h2>
            <p className="text-muted-foreground">
              Discover and follow talented designers who are revolutionizing the CAD marketplace.
            </p>
          </div>
          
          <CreatorLeaderboard className="max-w-4xl mx-auto" />
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/creators">View All Creators</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              Choose the plan that works best for your needs, with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Basic</h3>
                  <div className="mt-2 text-3xl font-bold">Free</div>
                  <p className="text-muted-foreground text-sm mt-1">For hobbyist creators</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Up to 5 model uploads</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Basic printability check</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Standard licensing options</p>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <div className="mt-2 text-3xl font-bold">₹999<span className="text-base font-normal text-muted-foreground">/month</span></div>
                  <p className="text-muted-foreground text-sm mt-1">For professional creators</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Unlimited model uploads</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Advanced printability analysis</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Custom licensing terms</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Priority support</p>
                  </li>
                </ul>
                <Button className="w-full">Subscribe Now</Button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <div className="mt-2 text-3xl font-bold">Custom</div>
                  <p className="text-muted-foreground text-sm mt-1">For organizations & OEMs</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">All Pro features</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Dedicated account manager</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Custom API integration</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Advanced analytics</p>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About FormVerse</h2>
              <p className="text-muted-foreground mb-4">
                FormVerse is India's first AI-powered platform dedicated to helping CAD creators monetize their designs while providing OEMs with access to high-quality, verified 3D models.
              </p>
              <p className="text-muted-foreground mb-4">
                Our proprietary AI system, FormIQ, helps validate model printability, suggest optimal pricing, and ensure designs meet industry standards before they reach the marketplace.
              </p>
              <p className="text-muted-foreground">
                Founded in 2023, we're on a mission to bridge the gap between CAD creators and manufacturers, fostering innovation and growth in India's 3D printing and manufacturing ecosystem.
              </p>
              <Button variant="outline" className="mt-6">Learn More</Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
                alt="About FormVerse" 
                className="relative z-10 rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your designs into income?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators already using FormVerse to monetize their CAD models.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/dashboard">Get Started Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/discover">Explore Models</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
