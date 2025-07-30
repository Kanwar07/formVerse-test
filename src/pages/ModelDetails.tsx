import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { APIService } from "@/services/api";
import { FileUploadService } from "@/services/fileUpload";
import { PaymentManager } from "@/services/payments";
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
  CheckCircle,
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ModelDetails = () => {
  const { modelId } = useParams();
  const [purchased, setPurchased] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial' | 'enterprise' | null>(null);
  const [currentStep, setCurrentStep] = useState<'preview' | 'analysis' | 'pricing'>('preview');
  const [secureModelUrl, setSecureModelUrl] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const paymentManager = new PaymentManager();

  // Initialize component with model data
  useEffect(() => {
    const initializeModel = async () => {
      setLoading(true);
      try {
        // For now, using mock data - replace with actual API call
        const mockModel = {
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
          filePath: "models/sample/industrial-gear-assembly.stl"
        };
        setModel(mockModel);
      } catch (error) {
        console.error('Error loading model:', error);
        toast({
          title: "Error loading model",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      initializeModel();
    }
  }, [modelId, toast]);

  const handlePurchase = async (licenseType: 'personal' | 'commercial' | 'enterprise') => {
    if (!model) return;
    
    setProcessing(true);
    setSelectedLicense(licenseType);
    
    try {
      const prices = {
        personal: model.price,
        commercial: model.price * 3,
        enterprise: model.price * 5
      };
      
      const amount = prices[licenseType];
      const currency = 'INR';
      
      // Get current user for payment metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to purchase a license.",
          variant: "destructive"
        });
        return;
      }

      const metadata = {
        modelName: model.name,
        licenseType,
        userName: user.user_metadata?.name || user.email,
        userEmail: user.email,
        modelId: model.id
      };

      // Process payment through Razorpay
      const paymentResult = await paymentManager.processPayment(
        'razorpay',
        model.id,
        `${licenseType}-license-id`, // This should be actual license type ID from database
        amount,
        currency,
        metadata
      );

      if (paymentResult) {
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
          description: `${licenseType} license purchased successfully. You can now download the model files.`,
        });
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setSelectedLicense(null);
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
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = (canPrint: boolean) => {
    if (canPrint) {
      setCurrentStep('pricing');
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

  const handleBackToPreview = () => {
    setCurrentStep('preview');
  };

  const handleBackToAnalysis = () => {
    setCurrentStep('analysis');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <div className="container py-8 max-w-6xl">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading model details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <div className="container py-8 max-w-6xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Model not found</h1>
            <p className="text-muted-foreground mb-6">The requested model could not be found.</p>
            <Button asChild>
              <Link to="/discover">← Back to Discover</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'preview' ? 'text-primary' : currentStep === 'analysis' || currentStep === 'pricing' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'preview' ? 'border-primary bg-primary text-primary-foreground' : currentStep === 'analysis' || currentStep === 'pricing' ? 'border-green-600 bg-green-600 text-white' : 'border-muted-foreground'}`}>
                1
              </div>
              <span className="text-sm font-medium">Model Preview</span>
            </div>
            
            <div className={`h-px w-12 ${currentStep === 'analysis' || currentStep === 'pricing' ? 'bg-green-600' : 'bg-muted-foreground'}`}></div>
            
            <div className={`flex items-center space-x-2 ${currentStep === 'analysis' ? 'text-primary' : currentStep === 'pricing' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'analysis' ? 'border-primary bg-primary text-primary-foreground' : currentStep === 'pricing' ? 'border-green-600 bg-green-600 text-white' : 'border-muted-foreground'}`}>
                2
              </div>
              <span className="text-sm font-medium">Model Analysis</span>
            </div>
            
            <div className={`h-px w-12 ${currentStep === 'pricing' ? 'bg-green-600' : 'bg-muted-foreground'}`}></div>
            
            <div className={`flex items-center space-x-2 ${currentStep === 'pricing' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'pricing' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                3
              </div>
              <span className="text-sm font-medium">Pricing & Purchase</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'preview' && (
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
                    Start Model Analysis
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Get detailed analysis, error detection, and pricing for 3D printing
                  </p>
                </CardContent>
              </Card>
              
              {/* Additional Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="similar">Similar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none text-sm">
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
        )}

        {currentStep === 'analysis' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToPreview}
                className="mb-4"
              >
                ← Back to Preview
              </Button>
            </div>
            <ModelAnalysisReport
              modelId={model.id!}
              modelName={model.name}
              fileUrl={model.fileUrl}
              onPurchase={() => console.log('Purchase initiated from analysis')}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {currentStep === 'pricing' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToAnalysis}
                className="mb-4"
              >
                ← Back to Analysis
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Pricing & Purchase Options</CardTitle>
                <p className="text-muted-foreground">Choose your licensing option and proceed with purchase</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Personal License</CardTitle>
                      <div className="text-2xl font-bold">₹{model.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Personal use only</li>
                        <li>• Single download</li>
                        <li>• Basic support</li>
                      </ul>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handlePurchase('personal')}
                        disabled={processing && selectedLicense === 'personal'}
                      >
                        {processing && selectedLicense === 'personal' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Proceed to Buy
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">Commercial License</CardTitle>
                      <div className="text-2xl font-bold">₹{model.price * 3}</div>
                      <Badge>Most Popular</Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Commercial use allowed</li>
                        <li>• Multiple downloads</li>
                        <li>• Priority support</li>
                        <li>• Customization rights</li>
                      </ul>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handlePurchase('commercial')}
                        disabled={processing && selectedLicense === 'commercial'}
                      >
                        {processing && selectedLicense === 'commercial' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Proceed to Buy
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Enterprise License</CardTitle>
                      <div className="text-2xl font-bold">₹{model.price * 5}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        <li>• Unlimited commercial use</li>
                        <li>• Team access</li>
                        <li>• Premium support</li>
                        <li>• Source files included</li>
                      </ul>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handlePurchase('enterprise')}
                        disabled={processing && selectedLicense === 'enterprise'}
                      >
                        {processing && selectedLicense === 'enterprise' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Proceed to Buy
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* 3D Printing Options */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">3D Printing Services</h3>
                  <CadQuaPricing 
                    modelId={model.id!}
                    modelName={model.name}
                    fileUrl={model.fileUrl}
                    onOrderPlaced={handleOrderPlaced}
                  />
                </div>
                
                {purchased && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Download Options</h3>
                    <EngagementGate 
                      modelId={model.id!}
                      modelName={model.name}
                      previewImage={model.thumbnail}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ModelDetails;
