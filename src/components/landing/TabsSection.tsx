
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

export function TabsSection() {
  const [activeTab, setActiveTab] = useState("creator");

  return (
    <section id="tabs" className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
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
  );
}
