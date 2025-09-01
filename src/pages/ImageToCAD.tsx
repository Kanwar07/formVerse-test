import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedCADViewer } from "@/components/preview/UnifiedCADViewer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { VFusion3DService } from "@/services/vfusion3d";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, Eye, Trash2, BookOpen, Image, RotateCcw, ZoomIn, RotateCw, Heart, Sparkles } from "lucide-react";

interface ConvertedModel {
  id: string;
  name: string;
  originalImage: string;
  modelUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  predictionId?: string;
  isFavorite?: boolean;
}

interface GenerationSettings {
  polycount: 'Adaptive' | 'Fixed';
  topology: 'Triangle' | 'Quad';
  symmetry: boolean;
  texture: string;
}

const ImageToCAD = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedModels, setConvertedModels] = useState<ConvertedModel[]>([]);
  const [previewModels, setPreviewModels] = useState<ConvertedModel[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [settings, setSettings] = useState<GenerationSettings>({
    polycount: 'Adaptive',
    topology: 'Triangle',
    symmetry: false,
    texture: ''
  });
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
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/')).slice(0, 3);
    
    if (imageFiles.length > 0) {
      setSelectedImages(imageFiles);
      
      // Create previews for all images
      const previews: string[] = new Array(imageFiles.length);
      let loadedCount = 0;
      
      imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target?.result as string;
          loadedCount++;
          if (loadedCount === imageFiles.length) {
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleConvertToCAD = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to convert",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    try {
      // Use our Supabase edge function to proxy the Modal API request
      const formData = new FormData();
      formData.append('input_image', selectedImages[0]); // Use first image for now
      
      // Add settings to form data
      formData.append('settings', JSON.stringify(settings));
      
      console.log('Sending image to Modal API via edge function...');
      console.log('Image file details:', {
        name: selectedImages[0].name,
        size: selectedImages[0].size,
        type: selectedImages[0].type,
        settings: settings
      });
      
      // Call our edge function with detailed logging
      const { data, error } = await supabase.functions.invoke('modal-image-to-cad', {
        body: formData,
      });
      
      if (error) {
        console.error('Edge function error details:', {
          message: error.message,
          details: error.details,
          code: error.code,
          context: error.context
        });
        
        // Handle specific error codes with user-friendly messages
        if (error.code === 'SERVICE_UNAVAILABLE') {
          throw new Error(`CADQUA AI service is unavailable. ${error.details || 'Please try again in a few minutes.'}`);
        } else if (error.code === 'CONNECTION_TIMEOUT') {
          throw new Error(`Connection timeout. The service may be starting up. Please try again in 30 seconds.`);
        } else if (error.code === 'GENERATION_TIMEOUT') {
          throw new Error(`Generation timed out. Try with a smaller image or simpler content.`);
        } else if (error.code === 'INVALID_RESPONSE') {
          throw new Error(`The AI service returned an invalid response. Please try again.`);
        } else if (error.code === 'NETWORK_ERROR') {
          throw new Error(`Network connection failed. Please check your internet connection.`);
        } else {
          throw new Error(error.details || error.message || 'Failed to generate 3D model');
        }
      }
      
      console.log('Modal API Response via edge function:', data);
      
      // Extract the generated model URL from the response
      let modelUrl = null;
      if (data && data.data && data.data[2]) {
        modelUrl = data.data[2];
      }
      
      if (!modelUrl || typeof modelUrl !== 'string') {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from CADQUA AI - no 3D model generated. Please try again.');
      }
      
      // Generate up to 4 preview models
      const newModels: ConvertedModel[] = [];
      for (let i = 0; i < 4; i++) {
        const newModel: ConvertedModel = {
          id: `${Date.now()}_${i}`,
          name: `${selectedImages[0].name.replace(/\.[^/.]+$/, "")}_v${i + 1}`,
          originalImage: imagePreviews[0] || '',
          status: modelUrl ? 'completed' : 'processing',
          createdAt: new Date().toISOString(),
          modelUrl: i === 0 ? modelUrl : undefined, // Only first model gets the actual URL
          predictionId: `${Date.now()}_${i}`,
          isFavorite: false
        };
        newModels.push(newModel);
      }

      setPreviewModels(newModels);
      if (modelUrl) {
        setConvertedModels(prev => [newModels[0], ...prev]);
      }
      
      toast({
        title: modelUrl ? "Conversion completed!" : "Conversion started!",
        description: modelUrl ? "Your 3D model has been generated successfully." : "Processing your image, please check back soon.",
      });

    } catch (error) {
      console.error('Error converting image:', error);
      toast({
        title: "Conversion failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please try again.`,
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

  const toggleFavorite = (id: string) => {
    setPreviewModels(prev => prev.map(model => 
      model.id === id ? { ...model, isFavorite: !model.isFavorite } : model
    ));
  };

  const handleRetry = () => {
    if (retryCount < 4) {
      setRetryCount(prev => prev + 1);
      handleConvertToCAD();
    } else {
      toast({
        title: "Maximum retries reached",
        description: "You've reached the maximum number of retries (4).",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 flex items-center justify-center pt-24">
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 pt-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Convert Image to CAD Model</h1>
            </div>
            <Badge variant="secondary" className="elegant-glass">
              CAD Upload Studio
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="elegant-glass border-border/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Tutorials
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Examples
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="elegant-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p>• Upload clear, single-object images with plain background for best results.</p>
                  <p>• You can retry model generation up to 4 times.</p>
                  <p>• Multi-view images (up to 3) enhance 3D model accuracy.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="elegant-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Image (Recommended: Front/Plain Background)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple
                    />
                    
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="space-y-2">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-20 object-cover rounded border"
                            />
                            <p className="text-xs text-muted-foreground">View {index + 1}</p>
                          </div>
                        ))}
                        {imagePreviews.length < 3 && (
                          <div className="border border-dashed border-border rounded flex items-center justify-center h-20">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-base font-medium">Drop images here or click to upload</p>
                          <p className="text-sm text-muted-foreground">Up to 3 images • JPG, PNG, JPEG</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="elegant-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Polycount</Label>
                    <Select value={settings.polycount} onValueChange={(value: 'Adaptive' | 'Fixed') => 
                      setSettings(prev => ({ ...prev, polycount: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adaptive">Adaptive</SelectItem>
                        <SelectItem value="Fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Topology</Label>
                    <Select value={settings.topology} onValueChange={(value: 'Triangle' | 'Quad') => 
                      setSettings(prev => ({ ...prev, topology: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Triangle">Triangle</SelectItem>
                        <SelectItem value="Quad">Quad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Symmetry</Label>
                  <Switch 
                    checked={settings.symmetry} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, symmetry: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Texture Description (Optional)</Label>
                  <Textarea 
                    placeholder="Describe desired style or upload texture image"
                    value={settings.texture}
                    onChange={(e) => setSettings(prev => ({ ...prev, texture: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleConvertToCAD}
                  disabled={selectedImages.length === 0 || isConverting}
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Generating 3D Model...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate 3D Model
                    </>
                  )}
                </Button>

                {previewModels.length > 0 && retryCount < 4 && (
                  <Button 
                    onClick={handleRetry}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Regenerate ({4 - retryCount} retries left)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* 3D Model Preview */}
            {previewModels.length > 0 && (
              <Card className="elegant-glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    3D Model Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {previewModels.map((model, index) => (
                      <div key={model.id} className="space-y-2">
                        <div className="relative bg-muted/20 rounded-lg h-40 flex items-center justify-center">
                          {model.modelUrl ? (
                            <UnifiedCADViewer
                              fileUrl={model.modelUrl}
                              fileName={model.name}
                              width={300}
                              height={160}
                              showControls={false}
                              autoRotate={true}
                            />
                          ) : (
                            <div className="text-center space-y-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto" />
                              <p className="text-xs text-muted-foreground">Processing...</p>
                            </div>
                          )}
                          
                          {model.modelUrl && (
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ZoomIn className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <RotateCw className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => toggleFavorite(model.id)}
                              >
                                <Heart className={`w-3 h-3 ${model.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Model {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Assets Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="elegant-glass border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Generated Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {convertedModels.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-3">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No models generated yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {convertedModels.slice(0, 5).map((model) => (
                      <div key={model.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{model.name}</p>
                          <Badge variant={model.status === 'completed' ? 'default' : 
                                         model.status === 'failed' ? 'destructive' : 'secondary'}>
                            {model.status}
                          </Badge>
                        </div>
                        
                        {model.modelUrl && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleDownloadModel(model.modelUrl!, model.name)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              STL
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleDownloadModel(model.modelUrl!, model.name)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              OBJ
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImageToCAD;