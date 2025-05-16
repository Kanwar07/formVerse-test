
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Search,
  SlidersHorizontal,
  Tag
} from "lucide-react";

const BuyerInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  
  // Mock data for models
  const mockModels = [
    {
      id: "model-1",
      name: "Industrial Gear Assembly",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3",
      price: 1999,
      creator: "MechDesigns",
      printabilityScore: 95,
      tags: ["industrial", "mechanical", "gear", "assembly"],
      licenseType: "Commercial"
    },
    {
      id: "model-2",
      name: "Modular Housing Frame",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3",
      price: 2499,
      creator: "ArchitectCAD",
      printabilityScore: 88,
      tags: ["housing", "architectural", "modular", "frame"],
      licenseType: "Standard"
    },
    {
      id: "model-3",
      name: "Medical Device Enclosure",
      thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      price: 3999,
      creator: "MedTech3D",
      printabilityScore: 96,
      tags: ["medical", "enclosure", "precision", "device"],
      licenseType: "Extended"
    },
    {
      id: "model-4",
      name: "Automotive Dashboard Component",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      price: 2799,
      creator: "AutoCAD Pro",
      printabilityScore: 91,
      tags: ["automotive", "dashboard", "interior", "component"],
      licenseType: "Commercial"
    },
    {
      id: "model-5",
      name: "Robotic Arm Joint",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3",
      price: 1499,
      creator: "RoboDesigns",
      printabilityScore: 93,
      tags: ["robotics", "joint", "mechanical", "precision"],
      licenseType: "Standard"
    },
    {
      id: "model-6",
      name: "Drone Propeller Guard",
      thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2420&ixlib=rb-4.0.3",
      price: 899,
      creator: "DroneWorks",
      printabilityScore: 87,
      tags: ["drone", "propeller", "protection", "lightweight"],
      licenseType: "Standard"
    }
  ];
  
  const handleAiSearch = () => {
    if (!aiPrompt) return;
    
    setIsSearching(true);
    
    // Simulate AI search delay
    setTimeout(() => {
      setIsSearching(false);
      setActiveTab("browse"); // Switch to browse tab to show "results"
    }, 1500);
  };
  
  const handleFilterChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  // Get score color class based on score value
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Discover CAD Models</h1>
          <p className="text-muted-foreground">Find printable, verified 3D models for your manufacturing needs</p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="browse" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse & Filter</TabsTrigger>
              <TabsTrigger value="ai-search">AI Prompt Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="space-y-4 pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search models, categories, or designers..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {mockModels.map((model) => (
                  <Card key={model.id} className="overflow-hidden flex flex-col">
                    <div className="relative">
                      <img 
                        src={model.thumbnail} 
                        alt={model.name} 
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge>
                          {model.licenseType}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="pt-4 flex-grow">
                      <h3 className="font-medium mb-1 line-clamp-1">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">By {model.creator}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="mr-2 text-xs">
                          <span className="text-muted-foreground">Printability:</span>
                        </div>
                        <Progress value={model.printabilityScore} className="h-1.5 flex-grow" />
                        <span className={`ml-2 text-xs font-medium ${getScoreColorClass(model.printabilityScore)}`}>
                          {model.printabilityScore}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {model.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {model.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{model.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-4 flex justify-between items-center">
                      <div className="font-medium">₹{model.price}</div>
                      <Button size="sm" asChild>
                        <Link to={`/printability/${model.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ai-search" className="pt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-center text-xl font-medium mb-2">FormIQ AI Model Search</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Describe what you're looking for in natural language. Our AI will find the best matches based on 
                    functionality, material compatibility, and printability.
                  </p>
                  
                  <div className="relative mb-4 max-w-2xl mx-auto">
                    <Textarea 
                      placeholder="Example: 'I need a durable industrial gear assembly compatible with ABS that can withstand high temperatures'"
                      className="min-h-[120px] pr-12"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <Button 
                      className="absolute right-2 bottom-2" 
                      size="sm"
                      onClick={handleAiSearch}
                      disabled={isSearching || !aiPrompt}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-w-2xl mx-auto">
                    <p className="text-sm font-medium">Try these example prompts:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => setAiPrompt("I need a medical device enclosure that's sterilizable and biocompatible")}>
                        Medical device enclosure, sterilizable
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => setAiPrompt("Looking for automotive parts that can withstand high vibration environments")}>
                        Automotive parts, vibration resistant
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => setAiPrompt("Drone components that are lightweight but durable for outdoor use")}>
                        Lightweight drone components
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => setAiPrompt("Industrial connectors compatible with high temperature environments")}>
                        High-temp industrial connectors
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Refine Results</h3>
              <Button variant="ghost" size="sm">
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="mt-4 px-2">
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    onValueChange={handleFilterChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">License Type</Label>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="license-standard" />
                    <label htmlFor="license-standard" className="ml-2 text-sm">Standard</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="license-commercial" />
                    <label htmlFor="license-commercial" className="ml-2 text-sm">Commercial</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="license-extended" />
                    <label htmlFor="license-extended" className="ml-2 text-sm">Extended</label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Printability Score</Label>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="score-90" />
                    <label htmlFor="score-90" className="ml-2 text-sm">90+ (Excellent)</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="score-80" />
                    <label htmlFor="score-80" className="ml-2 text-sm">80+ (Good)</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="score-70" />
                    <label htmlFor="score-70" className="ml-2 text-sm">70+ (Average)</label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Categories</Label>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="cat-industrial" />
                    <label htmlFor="cat-industrial" className="ml-2 text-sm">Industrial</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-medical" />
                    <label htmlFor="cat-medical" className="ml-2 text-sm">Medical</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-automotive" />
                    <label htmlFor="cat-automotive" className="ml-2 text-sm">Automotive</label>
                  </div>
                  <div className="flex items-center">
                    <Button variant="link" className="h-6 p-0">View all categories</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Popular Tags */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Tag className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Popular Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">industrial</Button>
            <Button variant="outline" size="sm">mechanical</Button>
            <Button variant="outline" size="sm">medical</Button>
            <Button variant="outline" size="sm">automotive</Button>
            <Button variant="outline" size="sm">consumer</Button>
            <Button variant="outline" size="sm">electronics</Button>
            <Button variant="outline" size="sm">aerospace</Button>
            <Button variant="outline" size="sm">robotics</Button>
            <Button variant="outline" size="sm">architectural</Button>
            <Button variant="outline" size="sm">precision</Button>
            <Button variant="outline" size="sm" className="flex items-center">
              More tags
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

// Define the Checkbox component since we need it
const Label = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

const Checkbox = ({ id }: { id: string }) => (
  <div className="h-4 w-4 border rounded flex items-center justify-center">
    <Check className="h-3 w-3 text-primary hidden peer-checked:block" />
  </div>
);

const Textarea = ({ placeholder, className, value, onChange }: { 
  placeholder: string, 
  className?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => (
  <textarea 
    placeholder={placeholder} 
    className={`w-full border rounded-md p-2 ${className}`}
    value={value}
    onChange={onChange}
  ></textarea>
);

export default BuyerInterface;
