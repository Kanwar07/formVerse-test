
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadQuaPricing } from "@/components/printing/CadQuaPricing";
import { 
  Download, 
  Eye, 
  Heart, 
  Share, 
  User, 
  Calendar,
  FileText,
  Package,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ModelDetails = () => {
  const { modelId } = useParams();
  const [purchased, setPurchased] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  // Mock model data - replace with actual data fetching
  const model = {
    id: modelId,
    name: "Industrial Gear Assembly",
    description: "High-precision industrial gear assembly designed for manufacturing applications. Features optimized tooth profiles for maximum efficiency and durability. Suitable for both prototyping and production use.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3",
    price: 1999,
    creator: "MechDesigns",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    printabilityScore: 95,
    tags: ["industrial", "mechanical", "gear", "assembly", "precision"],
    licenseType: "Commercial",
    fileSize: "24.3 MB",
    fileFormat: "STL",
    uploadDate: "2024-01-15",
    downloads: 234,
    likes: 45,
    fileUrl: "/models/industrial-gear-assembly.stl"
  };

  const handlePurchase = async () => {
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPurchased(true);
      toast({
        title: "Purchase successful!",
        description: "You can now download the model files and order 3D prints.",
      });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Download started",
        description: "Your model files are being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleOrderPlaced = (orderId: string) => {
    toast({
      title: "3D Print order placed!",
      description: `Order ${orderId} has been submitted to CadQua for processing.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Preview */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <img 
                  src={model.thumbnail} 
                  alt={model.name}
                  className="w-full aspect-square object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View 3D Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Format:</span>
                  <span className="font-medium">{model.fileFormat}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">{model.fileSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upload Date:</span>
                  <span className="font-medium">{model.uploadDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span className="font-medium">{model.downloads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Printability Score:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={model.printabilityScore} className="w-20 h-2" />
                    <span className="text-sm font-medium text-green-600">
                      {model.printabilityScore}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Model Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <img 
                    src={model.creatorAvatar} 
                    alt={model.creator}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <Link to={`/creator/${model.creator}`} className="text-sm hover:underline">
                    {model.creator}
                  </Link>
                </div>
                <Badge>{model.licenseType}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {model.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6">{model.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold">₹{model.price}</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {!purchased ? (
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full" size="lg" onClick={handlePurchase}>
                    Purchase Model - ₹{model.price}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Includes commercial license and all source files
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Purchase Complete!</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <Download className="h-4 w-4 mr-2 animate-bounce" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Files
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                {/* CadQua 3D Printing Integration */}
                <CadQuaPricing 
                  modelId={model.id!}
                  modelName={model.name}
                  fileUrl={model.fileUrl}
                  onOrderPlaced={handleOrderPlaced}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="similar">Similar Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <h4>Design Features</h4>
                    <ul>
                      <li>Optimized tooth profiles for maximum efficiency</li>
                      <li>Precision-engineered for manufacturing applications</li>
                      <li>Compatible with standard bearing assemblies</li>
                      <li>Designed for both prototyping and production</li>
                    </ul>
                    
                    <h4>Recommended Print Settings</h4>
                    <ul>
                      <li>Layer Height: 0.2mm</li>
                      <li>Infill: 20-40%</li>
                      <li>Support: Minimal required</li>
                      <li>Print Speed: 50-60 mm/s</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this model!</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="similar" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Similar Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discover more models from this creator and similar categories.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ModelDetails;
