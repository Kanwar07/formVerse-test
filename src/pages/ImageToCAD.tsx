import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { VFusion3DService } from "@/services/vfusion3d";
import { Upload, Download, Eye, Trash2, Search, Grid, List, Sparkles, Zap } from "lucide-react";

interface ConvertedModel {
  id: string;
  name: string;
  originalImage: string;
  modelUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  predictionId?: string;
}

const ImageToCAD = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedModels, setConvertedModels] = useState<ConvertedModel[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load user's existing models on component mount
  useEffect(() => {
    if (user) {
      loadUserModels();
    }
  }, [user]);

  const loadUserModels = async () => {
    try {
      const jobs = await VFusion3DService.getUserJobs(user?.id || '');
      const models: ConvertedModel[] = jobs.map(job => ({
        id: job.id,
        name: job.image_url.split('/').pop()?.replace(/\.[^/.]+$/, "") || 'Untitled',
        originalImage: job.image_url,
        modelUrl: job.result_url,
        status: job.status === 'succeeded' ? 'completed' : 
               job.status === 'failed' ? 'failed' : 'processing',
        createdAt: job.created_at,
        predictionId: job.prediction_id
      }));
      setConvertedModels(models);
    } catch (error) {
      console.error('Error loading user models:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvertToCAD = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to convert",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Use the Modal API directly instead of VFusion3DService
      const formData = new FormData();
      formData.append('input_image', selectedImage);
      
      console.log('Sending image to Modal API...');
      
      // Call the Modal API
      const response = await fetch('https://formversedude--cadqua-3d-generator-gradio-app.modal.run/api/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Modal API request failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Modal API Response:', result);
      
      // Extract the generated model URL from the response
      let modelUrl = null;
      if (result && result.data && result.data[0]) {
        modelUrl = result.data[0].url || result.data[0];
      }
      
      const newModel: ConvertedModel = {
        id: Date.now().toString(),
        name: selectedImage.name.replace(/\.[^/.]+$/, ""),
        originalImage: imagePreview!,
        status: 'completed',
        createdAt: new Date().toISOString(),
        modelUrl: modelUrl,
        predictionId: Date.now().toString()
      };

      setConvertedModels(prev => [newModel, ...prev]);
      
      toast({
        title: "Conversion completed!",
        description: "Your 3D model has been generated successfully.",
      });

      // Reset form
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error converting image:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const checkJobStatus = async (predictionId: string) => {
    try {
      const status = await VFusion3DService.checkJobStatus(predictionId);
      
      setConvertedModels(prev => 
        prev.map(model => 
          model.predictionId === predictionId 
            ? { 
                ...model, 
                status: status.status === 'succeeded' ? 'completed' : 
                       status.status === 'failed' ? 'failed' : 'processing',
                modelUrl: status.output || model.modelUrl
              }
            : model
        )
      );
    } catch (error) {
      console.error('Error checking job status:', error);
    }
  };

  const handleDownloadModel = async (modelUrl: string, filename: string) => {
    try {
      await VFusion3DService.downloadModel(modelUrl, `${filename}.obj`);
      toast({
        title: "Download started",
        description: "Your 3D model is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the model.",
        variant: "destructive"
      });
    }
  };

  const removeModel = (id: string) => {
    setConvertedModels(prev => prev.filter(model => model.id !== id));
    toast({
      title: "Model removed",
      description: "The model has been removed from your library.",
    });
  };

  const filteredModels = convertedModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 flex items-center justify-center">
          <Card className="max-w-md glass-card border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Transform Images to 3D</CardTitle>
              <p className="text-muted-foreground">
                Sign in to access our AI-powered image to CAD converter
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-50" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Transform Images into <span className="text-accent">3D Models</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload any image and watch our AI convert it into a detailed 3D CAD model in seconds
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Upload Section */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-primary/50" />
                      <div>
                        <p className="text-lg font-medium">Click to upload image</p>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </Label>
              </div>

              <Button 
                onClick={handleConvertToCAD}
                disabled={!selectedImage || isConverting}
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {isConverting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Converting...
                  </div>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Convert to 3D
                  </>
                )}
              </Button>

              {isConverting && (
                <div className="space-y-2">
                  <Progress value={33} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing your image...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Info */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Upload Image</h3>
                    <p className="text-sm text-muted-foreground">Upload any image you want to convert to 3D</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Processing</h3>
                    <p className="text-sm text-muted-foreground">Our AI analyzes your image and generates a 3D model</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Download</h3>
                    <p className="text-sm text-muted-foreground">Get your 3D model file ready for CAD or 3D printing</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <p className="text-sm text-center">
                  <strong>Supported formats:</strong> JPG, PNG, GIF • <strong>Output:</strong> OBJ, STL
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Library Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your 3D Library
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {filteredModels.length === 0 ? (
            <Card className="glass-card border-primary/20">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-semibold">No models yet</h3>
                  <p className="text-muted-foreground">
                    Upload your first image to start building your 3D library
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredModels.map((model) => (
                <Card key={model.id} className="glass-card border-primary/20 group hover:scale-105 transition-transform">
                  <CardContent className="p-4">
                    {viewMode === 'grid' ? (
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={model.originalImage} 
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold truncate">{model.name}</h3>
                          <div className="flex items-center justify-between">
                            <Badge variant={
                              model.status === 'completed' ? 'default' :
                              model.status === 'processing' ? 'secondary' : 'destructive'
                            }>
                              {model.status}
                            </Badge>
                            <div className="flex gap-1">
                              {model.status === 'processing' && model.predictionId && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => checkJobStatus(model.predictionId!)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {model.status === 'completed' && model.modelUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownloadModel(model.modelUrl!, model.name)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeModel(model.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={model.originalImage} 
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{model.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(model.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            model.status === 'completed' ? 'default' :
                            model.status === 'processing' ? 'secondary' : 'destructive'
                          }>
                            {model.status}
                          </Badge>
                          
                          <div className="flex gap-1">
                            {model.status === 'processing' && model.predictionId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => checkJobStatus(model.predictionId!)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {model.status === 'completed' && model.modelUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadModel(model.modelUrl!, model.name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeModel(model.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageToCAD;