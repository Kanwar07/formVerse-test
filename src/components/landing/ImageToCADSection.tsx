
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, ArrowRight, Zap, Download, FileImage, Cpu, Box } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImageToCADSection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [modelFileUrl, setModelFileUrl] = useState<string | null>(null);

  const handleConvertToCAD = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create FormData for the Modal API request
      const formData = new FormData();
      formData.append('input_image', selectedImage);
      
      console.log('Sending image to Modal API...');
      
      // Call the Modal API
      const response = await fetch('https://formversedude--cadqua-3d-generator-gradio-app.modal.run/generate_and_extract_glb', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Modal API request failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Modal API Response:', result);
      
      // Handle the new response format
      if (result) {
        // New format: { video: videoPath, glb: glbPath, download: downloadPath }
        if (result.glb || result.download) {
          setModelFileUrl(result.glb || result.download);
        }
        // Fallback to old format if new format not available
        else if (result.data && result.data[0]) {
          setModelFileUrl(result.data[0].url || result.data[0]);
        }
      }
      
      setIsProcessing(false);
      setModelReady(true);
      toast({
        title: "CAD conversion completed!",
        description: "Your 3D model has been generated successfully.",
      });
      
    } catch (error) {
      console.error('Error converting image to CAD:', error);
      setIsProcessing(false);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!modelFileUrl) {
      toast({
        title: "No model available",
        description: "Please generate a model first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Download the actual generated model file
      const response = await fetch(modelFileUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-model.stl';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started!",
        description: "Your generated STL file is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading model:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the model file.",
        variant: "destructive"
      });
    }
  };

  const handleView3D = () => {
    if (modelFileUrl) {
      // Open the model file in a new tab for viewing
      window.open(modelFileUrl, '_blank');
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dark gradient background inspired by AdamCAD */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      
      <div className="container relative">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Image to CAD</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Transform anything into{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              3D models
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Upload any image and watch our AI convert it into a precise 3D CAD model in seconds. 
            Perfect for rapid prototyping, reverse engineering, and bringing ideas to life.
          </p>
        </div>

        {/* Main Conversion Interface */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Upload Area */}
                <div className="space-y-6">
                  <div className="text-center">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="group cursor-pointer block"
                    >
                      <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5">
                        {previewUrl ? (
                          <div className="space-y-4">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl shadow-lg"
                            />
                            <p className="text-sm text-muted-foreground font-medium">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Drop your image here</h3>
                              <p className="text-muted-foreground">
                                or click to browse • JPG, PNG, WEBP up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <Button
                    onClick={handleConvertToCAD}
                    disabled={!selectedImage || isProcessing}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Generating 3D Model...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5" />
                        Convert to 3D Model
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  {/* Result Section */}
                  {modelReady && (
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 animate-fade-in">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          <Download className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">Model Generated!</h4>
                          <p className="text-sm text-muted-foreground">Your 3D CAD file is ready</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleDownload} className="h-12">
                          <Download className="h-4 w-4 mr-2" />
                          Download STL
                        </Button>
                        <Button variant="outline" className="h-12" onClick={handleView3D}>
                          <Box className="h-4 w-4 mr-2" />
                          View 3D
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Process Visualization */}
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-3">How it works</h3>
                    <p className="text-muted-foreground">Three simple steps to 3D magic</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Upload Image</h4>
                        <p className="text-sm text-muted-foreground">Any photo or sketch works</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                        <Cpu className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold">AI Processing</h4>
                        <p className="text-sm text-muted-foreground">Advanced algorithms analyze your image</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center">
                        <Box className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold">3D Model Ready</h4>
                        <p className="text-sm text-muted-foreground">Download CAD files instantly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate professional 3D models from images in under 30 seconds with our optimized AI pipeline.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Precision</h3>
              <p className="text-muted-foreground">
                Advanced computer vision and machine learning ensure accurate geometry reconstruction.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Download className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">CAD Ready</h3>
              <p className="text-muted-foreground">
                Export to STL, OBJ, STEP, and IGES formats compatible with all major CAD software.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
