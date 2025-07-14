
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Zap, Download, ArrowRight, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { VFusion3DService, type VFusion3DResponse } from "@/services/vfusion3d";

const ImageToCAD = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<VFusion3DResponse | null>(null);
  const [jobStatus, setJobStatus] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Poll job status every 10 seconds while processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentJob && isProcessing) {
      interval = setInterval(async () => {
        try {
          const statusResponse = await VFusion3DService.checkJobStatus(currentJob.predictionId);
          setJobStatus(statusResponse.status);
          
          if (statusResponse.status === 'succeeded') {
            setIsProcessing(false);
            setResultUrl(statusResponse.output?.[0] || null);
            setProcessingProgress(100);
            toast({
              title: "3D model generated successfully!",
              description: "Your CAD model is ready for download.",
            });
          } else if (statusResponse.status === 'failed') {
            setIsProcessing(false);
            toast({
              title: "Conversion failed",
              description: statusResponse.error || "An error occurred during processing.",
              variant: "destructive"
            });
          } else if (statusResponse.status === 'processing') {
            // Simulate progress (VFusion3D doesn't provide actual progress)
            setProcessingProgress(prev => Math.min(prev + 5, 90));
          }
        } catch (error) {
          console.error('Error checking job status:', error);
        }
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentJob, isProcessing, toast]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setCurrentJob(null);
      setResultUrl(null);
      setJobStatus('');
      setProcessingProgress(0);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvertToCAD = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to convert images to 3D models.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(10);
    
    try {
      const response = await VFusion3DService.convertImageTo3D(selectedImage, user.id);
      setCurrentJob(response);
      setJobStatus(response.status);
      setProcessingProgress(20);
      
      toast({
        title: "Conversion started!",
        description: "Your image is being converted to a 3D model. This may take 2-5 minutes.",
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Error starting conversion:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) {
      toast({
        title: "No model available",
        description: "Please wait for the conversion to complete.",
        variant: "destructive"
      });
      return;
    }

    try {
      await VFusion3DService.downloadModel(resultUrl, `formverse_3d_model_${Date.now()}.obj`);
      toast({
        title: "Download started",
        description: "Your 3D model file is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading model:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your model.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Image to CAD Converter</h1>
            <p className="text-xl text-muted-foreground">
              Transform any image into a detailed 3D CAD model using our advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Your Image
                </CardTitle>
                <CardDescription>
                  Upload a clear image of the object you want to convert to CAD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Choose Image File</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                
                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                
                {/* Status and Progress */}
                {isProcessing && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Status: {jobStatus || 'Starting conversion...'}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This process typically takes 2-5 minutes. Please keep this page open.
                    </p>
                  </div>
                )}

                {/* Success State */}
                {resultUrl && !isProcessing && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">3D Model Generated Successfully!</span>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleConvertToCAD}
                  disabled={!selectedImage || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Converting to 3D Model...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Convert to 3D Model
                    </>
                  )}
                </Button>

                {resultUrl && !isProcessing && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download 3D Model (OBJ)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Process Steps */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">How it works:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Upload Image</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload a clear photo of the object from multiple angles for best results
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">VFusion3D AI Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced VFusion3D neural network analyzes your image and reconstructs 3D geometry
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">3D Model Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate a detailed 3D CAD model ready for manufacturing or 3D printing
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Download & Refine</h4>
                    <p className="text-sm text-muted-foreground">
                      Download your CAD file and make adjustments using our editing tools
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Image className="h-5 w-5 text-primary" />
                    <span className="font-medium">Supported Formats</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, WEBP • Export as OBJ, STL, PLY formats
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-accent/5 to-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-medium">Pro Features</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Batch processing for multiple images</li>
                    <li>• Advanced material suggestions</li>
                    <li>• Printability analysis</li>
                    <li>• Custom export formats</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageToCAD;
