import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { APIService } from "@/services/api";
import { FileUploadService } from "@/services/fileUpload";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadQuaPricing } from "@/components/printing/CadQuaPricing";
import { ModelPreview } from "@/components/preview/ModelPreview";
import { Enhanced3DViewer } from "@/components/three/Enhanced3DViewer";
import { EngagementGate } from "@/components/buyer/EngagementGate";
import { PreviewSelector } from "@/components/preview/PreviewSelector";
import { ModelAnalysisReport } from "@/components/analysis/ModelAnalysisReport";
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
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<'preview' | 'analysis'>('preview');
  const [secureModelUrl, setSecureModelUrl] = useState<string | null>(null);
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
    fileUrl: "/models/industrial-gear-assembly.stl",
    filePath: "models/sample/industrial-gear-assembly.stl" // Supabase storage path
  };

  const handlePurchase = async () => {
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPurchased(true);
      
      // Generate secure URL for 3D viewing after purchase
      try {
        const secureUrl = await FileUploadService.getSecureFileUrl('3d-models', model.filePath);
        setSecureModelUrl(secureUrl);
      } catch (error) {
        console.error('Failed to generate secure URL:', error);
      }
      
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
      if (!purchased) {
        toast({
          title: "Purchase required",
          description: "Please purchase a license before downloading.",
          variant: "destructive"
        });
        return;
      }

      // For demo purposes, simulate purchasing personal license and download
      // In real implementation, use actual license from purchase
      const { data: license } = await supabase
        .from('model_licenses')
        .select('*')
        .eq('model_id', modelId)
        .eq('license_type_id', 'e3fb40c4-51a7-42d2-b768-5c60be04d0de') // Personal license
        .single();

      if (!license) {
        throw new Error('License not found');
      }

      // Generate download token
      const token = await APIService.generateDownloadToken(modelId!, license.id);
      
      // Create download URL using secure download function
      const downloadUrl = `https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/secure-download/${token}`;
      
      // Trigger download
      window.open(downloadUrl, '_blank');
      
      toast({
        title: "Download started",
        description: "Your model files are being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
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

  const handleAnalyzeModel = () => {
    setShowAnalysis(true);
    setAnalysisStep('analysis');
  };

  const handleAnalysisComplete = (canPrint: boolean) => {
    if (canPrint) {
      toast({
        title: "Analysis Complete",
        description: "Your model is ready for 3D printing!",
      });
    } else {
      toast({
        title: "Issues Found",
        description: "Please fix critical issues before proceeding.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8 max-w-6xl">
        {!showAnalysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Model Preview */}
            <div className="space-y-4">
              {purchased ? (
                <Enhanced3DViewer
                  modelUrl={secureModelUrl || model.fileUrl}
                  fileName="industrial-gear-assembly.stl"
                  fileType={model.fileFormat}
                  width={600}
                  height={400}
                  showControls={true}
                  autoRotate={true}
                  onModelLoad={(info) => console.log('Model loaded:', info)}
                  onError={(error) => console.error('Model load error:', error)}
                />
              ) : (
                <PreviewSelector
                  modelName={model.name}
                  thumbnail={model.thumbnail}
                  fileUrl={purchased ? model.fileUrl : undefined}
                  fileName={purchased ? "industrial-gear-assembly.stl" : undefined}
                  fileType={purchased ? model.fileFormat : undefined}
                  isOwner={false}
                  isPurchased={purchased}
                  price={model.price}
                  onPurchase={handlePurchase}
                />
              )}
              
              {/* Engagement Gate for Downloads/Licensing */}
              {purchased && (
                <EngagementGate 
                  modelId={model.id!}
                  modelName={model.name}
                  previewImage={model.thumbnail}
                />
              )}
              
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
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleAnalyzeModel}
                    variant="default"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze Model for Printing
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Get detailed analysis, error detection, and pricing for 3D printing
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ModelAnalysisReport
              modelId={model.id!}
              modelName={model.name}
              fileUrl={model.fileUrl}
              onPurchase={handlePurchase}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}
        
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
