import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Palette, 
  Brush, 
  Layers, 
  Image, 
  Sparkles,
  Download,
  Upload,
  Eye
} from "lucide-react";

export const TexturingWorkspace = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Texturing Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Material Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 3D Preview Area */}
                <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">3D Model Preview</p>
                    <p className="text-xs text-muted-foreground">Select a model to start texturing</p>
                  </div>
                </div>

                {/* Material Properties */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Base Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-blue-500"></div>
                      <Button variant="outline" size="sm">Pick Color</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Roughness</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Metallic</label>
                    <Slider defaultValue={[20]} max={100} step={1} />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Normal Intensity</label>
                    <Slider defaultValue={[100]} max={200} step={1} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Texture Library & Tools */}
        <div className="space-y-6">
          {/* Texture Library */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="w-4 h-4" />
                Texture Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["Metal", "Wood", "Fabric", "Stone", "Plastic", "Glass"].map((material) => (
                  <Button key={material} variant="outline" size="sm" className="text-xs">
                    {material}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-muted/50 rounded cursor-pointer hover:bg-muted group relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Texture
              </Button>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Brush className="w-4 h-4 mr-2" />
                Smart UV Unwrap
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Layers className="w-4 h-4 mr-2" />
                Auto Materials
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Image className="w-4 h-4 mr-2" />
                Texture Synthesis
              </Button>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format</span>
                  <Badge variant="outline">PBR</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resolution</span>
                  <Badge variant="outline">2048x2048</Badge>
                </div>
              </div>
              
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Textures
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};