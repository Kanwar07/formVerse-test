
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";

const Services = () => {
  const [activeTab, setActiveTab] = useState("browse-services");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock service data
  const mockServices = [
    {
      id: "1",
      creator: "John Doe",
      title: "Custom Automotive Bracket Design",
      description: "I will design a print-ready automotive bracket with stress analysis and material recommendations",
      price: "₹2,500",
      deliveryTime: "3 days",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2074&auto=format&fit=crop",
      tags: ["automotive", "mechanical", "3d-printing"]
    },
    {
      id: "2",
      creator: "Sarah Chen",
      title: "Medical Device Prototype Design",
      description: "Professional medical device prototyping with regulatory compliance considerations",
      price: "₹5,000",
      deliveryTime: "7 days",
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1887&auto=format&fit=crop",
      tags: ["medical", "healthcare", "compliance"]
    },
    {
      id: "3",
      creator: "Mike Rodriguez",
      title: "Consumer Product Design & Optimization",
      description: "Complete consumer product design from concept to manufacturing-ready files",
      price: "₹3,500",
      deliveryTime: "5 days",
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1780&auto=format&fit=crop",
      tags: ["consumer", "product-design", "manufacturing"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Creator Services</h1>
          <p className="text-xl text-muted-foreground">
            Hire expert CAD creators for custom design projects
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse-services">Browse Services</TabsTrigger>
            <TabsTrigger value="post-project">Post Project</TabsTrigger>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="browse-services" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">by {service.creator}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>⭐ {service.rating} ({service.reviews})</span>
                      <span>{service.deliveryTime}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{service.price}</span>
                      <Button>Hire Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="post-project">
            <Card>
              <CardHeader>
                <CardTitle>Post a New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Project Brief
                  </Button>
                  <p className="mt-4 text-muted-foreground">
                    Describe your project and receive proposals from qualified creators
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-projects">
            <Card>
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No projects yet. Post your first project to get started!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
