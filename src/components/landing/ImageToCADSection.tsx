
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Zap, Download } from "lucide-react";
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
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setModelReady(true);
      toast({
        title: "CAD conversion completed!",
        description: "Your 3D model is ready for download and viewing.",
      });
    }, 3000);
  };

  const handleDownload = () => {
    // Create a mock STL file content for demo purposes
    const mockSTLContent = `solid model
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0.5 1 0
    endloop
  endfacet
endsolid model`;

    const blob = new Blob([mockSTLContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-model.stl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started!",
      description: "Your STL file is being downloaded.",
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Image to CAD Conversion</h2>
          <p className="text-muted-foreground text-lg">
            Transform any image into a detailed 3D CAD model using our advanced AI technology. 
            Perfect for rapid prototyping and design iteration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
              
              <Button
                onClick={handleConvertToCAD}
                disabled={!selectedImage || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Converting to CAD...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Convert to CAD
                  </>
              )}
              </Button>
              
              {/* Model Ready Section */}
              {modelReady && (
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">Model Ready!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your 3D CAD model has been generated successfully. You can now download it or view it in 3D.
                  </p>
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download STL
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View 3D Model
                    </Button>
                  </div>
                </div>
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
                  <h4 className="font-medium">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes the image to understand geometry, dimensions, and features
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
                  JPG, PNG, WEBP • Export as STL, OBJ, STEP, IGES
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
