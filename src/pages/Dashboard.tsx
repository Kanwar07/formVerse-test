
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, Clock, Download, File, FileImage, Upload, Users } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("models");

  const mockModels = [
    {
      id: "model-1",
      name: "Industrial Gear Assembly",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3",
      status: "approved",
      printabilityScore: 95,
      downloads: 127,
      revenue: 9650
    },
    {
      id: "model-2",
      name: "Modular Housing Frame",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3",
      status: "pending",
      printabilityScore: 82,
      downloads: 0,
      revenue: 0
    },
    {
      id: "model-3",
      name: "Medical Device Enclosure",
      thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      status: "rejected",
      printabilityScore: 45,
      downloads: 0,
      revenue: 0
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Creator Dashboard</h1>
            <p className="text-muted-foreground">Manage your models, track performance, and get AI insights.</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Model
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Models</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <FileImage className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Downloads</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="text-2xl font-bold">₹9,650</p>
              </div>
              <File className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Unique Buyers</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="models" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="models">My Models</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Models</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockModels.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <div className="aspect-video w-full relative">
                    <img 
                      src={model.thumbnail} 
                      alt={model.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={
                          model.status === "approved" ? "default" : 
                          model.status === "pending" ? "outline" : 
                          "destructive"
                        }
                      >
                        {model.status === "approved" ? "Approved" : 
                          model.status === "pending" ? "Pending Review" : 
                          "Needs Revision"
                        }
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>
                      Printability Score: {model.printabilityScore}/100
                    </CardDescription>
                    <Progress value={model.printabilityScore} className="h-2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Downloads</p>
                        <p className="text-sm font-medium">{model.downloads}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-medium">₹{model.revenue}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/printability/${model.id}`}>View Report</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/model/${model.id}/history`}>
                          History
                          <Clock className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* Upload Card */}
              <Card className="border-dashed flex flex-col items-center justify-center text-center p-6 h-full">
                <Upload className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <h3 className="font-medium mb-2">Upload New Model</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag & drop or click to upload STL, OBJ, or STEP files
                </p>
                <Button asChild>
                  <Link to="/upload">
                    Upload Model
                  </Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View detailed performance metrics for your models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Charts and analytics will be displayed here.</p>
                  <Button variant="outline" className="mt-4">Generate Full Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track earnings and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Payment history will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Account settings will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Recommendations */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                </div>
                FormIQ AI Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your model performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm">Increasing the polygon count in "Industrial Gear Assembly" could improve printability score by up to 12%.</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm">Consider adjusting your pricing strategy. Models similar to yours are priced 15% higher on average.</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm">Adding 'aerospace' and 'precision' to your model tags could increase discoverability by 32%.</p>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="#">
                  View All AI Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
