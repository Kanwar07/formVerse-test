import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Brush, 
  Palette, 
  Image, 
  Wand2,
  Download,
  Upload,
  Eye,
  Filter,
  Sun,
  Contrast
} from "lucide-react";

export const StylingWorkspace = () => {
  const stylePresets = [
    { name: "Cyberpunk", color: "from-cyan-500 to-purple-500" },
    { name: "Vintage", color: "from-amber-500 to-orange-500" },
    { name: "Minimalist", color: "from-gray-400 to-gray-600" },
    { name: "Neon", color: "from-pink-500 to-blue-500" },
    { name: "Industrial", color: "from-slate-500 to-zinc-600" },
    { name: "Organic", color: "from-green-500 to-teal-500" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Styling Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Style Transfer & Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 3D Preview with Styling */}
                <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Styled Model Preview</p>
                    <p className="text-xs text-muted-foreground">Apply styles to see real-time results</p>
                  </div>
                </div>

                {/* Style Controls */}
                <Tabs defaultValue="presets" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="presets" className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Style Presets
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      Custom Effects
                    </TabsTrigger>
                    <TabsTrigger value="lighting" className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Lighting
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="presets" className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {stylePresets.map((preset) => (
                        <Card key={preset.name} className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                          <CardContent className="p-3">
                            <div className={`w-full h-20 rounded bg-gradient-to-r ${preset.color} mb-2`}></div>
                            <p className="text-sm font-medium text-center">{preset.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-muted-foreground">Style Intensity</span>
                      <div className="w-32">
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Saturation</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Contrast</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Brightness</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Hue Shift</label>
                        <Slider defaultValue={[0]} min={-180} max={180} step={1} />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full" variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Custom Filter
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="lighting" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Light Intensity</label>
                        <Slider defaultValue={[80]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Shadow Softness</label>
                        <Slider defaultValue={[60]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Ambient Light</label>
                        <Slider defaultValue={[30]} max={100} step={1} />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Color Temperature</label>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools & Options */}
        <div className="space-y-6">
          {/* AI Style Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                AI Style Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Drop reference image</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transfer Strength</label>
                <Slider defaultValue={[70]} max={100} step={1} />
              </div>
              
              <Button className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Apply Style Transfer
              </Button>
            </CardContent>
          </Card>

          {/* Quick Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Holographic
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Brush className="w-4 h-4 mr-2" />
                Weathered
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Contrast className="w-4 h-4 mr-2" />
                High Contrast
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Image className="w-4 h-4 mr-2" />
                Cartoon Style
              </Button>
            </CardContent>
          </Card>

          {/* Style History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Style History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Cyberpunk + 75%", "Original", "Neon + 50%"].map((style, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer">
                    <span className="text-sm">{style}</span>
                    {i === 0 && <Badge variant="secondary" className="text-xs">Current</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export Styled Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality</span>
                  <Badge variant="outline">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include Textures</span>
                  <Badge variant="outline">Yes</Badge>
                </div>
              </div>
              
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Final Model
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};