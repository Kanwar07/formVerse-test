
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  features: string[];
  category: string;
}

interface HireMeTabProps {
  creatorName: string;
  creatorRating: number;
  completedProjects: number;
}

export const HireMeTab = ({ creatorName, creatorRating, completedProjects }: HireMeTabProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customRequest, setCustomRequest] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const { toast } = useToast();

  const services: Service[] = [
    {
      id: "1",
      title: "Custom Automotive Bracket",
      description: "Design a print-ready automotive bracket with stress analysis",
      price: "₹2,500",
      deliveryTime: "3 days",
      features: ["3D Model", "Technical Drawings", "Stress Analysis", "Material Recommendations"],
      category: "Automotive"
    },
    {
      id: "2", 
      title: "Product Prototype Design",
      description: "Complete product prototype from concept to manufacturing files",
      price: "₹5,000",
      deliveryTime: "7 days",
      features: ["Concept Development", "3D Modeling", "Technical Drawings", "Manufacturing Files", "Assembly Instructions"],
      category: "Product Design"
    },
    {
      id: "3",
      title: "Quick CAD Conversion",
      description: "Convert sketches or ideas into professional CAD files",
      price: "₹1,500",
      deliveryTime: "2 days",
      features: ["3D Model", "Basic Drawings", "STL Files"],
      category: "CAD Services"
    }
  ];

  const handleHireRequest = () => {
    toast({
      title: "Request sent!",
      description: `Your hiring request has been sent to ${creatorName}. They will respond within 24 hours.`,
    });
    setSelectedService(null);
    setCustomRequest("");
    setProjectDetails("");
  };

  return (
    <div className="space-y-6">
      {/* Creator Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{creatorRating}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Rating
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{completedProjects}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Projects
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Response
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Packages */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Service Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">{service.category}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{service.price}</div>
                    <div className="text-sm text-muted-foreground">{service.deliveryTime}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{service.description}</p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">What you get:</div>
                  <ul className="text-sm space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedService(service)}
                    >
                      Hire for {service.price}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Hire {creatorName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{selectedService?.title}</h4>
                        <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="projectDetails">Project Details</Label>
                        <Textarea
                          id="projectDetails"
                          placeholder="Describe your specific requirements, timeline, and any additional details..."
                          value={projectDetails}
                          onChange={(e) => setProjectDetails(e.target.value)}
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">Cancel</Button>
                        </DialogTrigger>
                        <Button onClick={handleHireRequest} className="flex-1">
                          Send Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Custom Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't see what you need? Send a custom request and {creatorName} will provide a personalized quote.
          </p>
          
          <div>
            <Label htmlFor="customRequest">Describe your project</Label>
            <Textarea
              id="customRequest"
              placeholder="Tell us about your project requirements, timeline, budget, and any specific needs..."
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleHireRequest} className="w-full">
            Send Custom Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
