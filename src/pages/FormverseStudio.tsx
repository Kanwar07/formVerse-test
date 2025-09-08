import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, 
  Image, 
  Wand2, 
  Palette, 
  Grid3x3, 
  Sparkles,
  Search,
  Download,
  Eye,
  Tag,
  Filter,
  Plus,
  FileText,
  Camera,
  Layers,
  Settings
} from "lucide-react";
import { AssetSidebar } from "@/components/studio/AssetSidebar";
import { GenerationWorkspace } from "@/components/studio/GenerationWorkspace";
import { TexturingWorkspace } from "@/components/studio/TexturingWorkspace";
import { RemeshingWorkspace } from "@/components/studio/RemeshingWorkspace";
import { StylingWorkspace } from "@/components/studio/StylingWorkspace";

const FormverseStudio = () => {
  const [activeTab, setActiveTab] = useState("generation");
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [textPrompt, setTextPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const workflowStages = [
    { id: "generation", label: "Generation", icon: Wand2, description: "Create 3D models from text or images" },
    { id: "texturing", label: "Texturing", icon: Palette, description: "Apply materials and textures" },
    { id: "remeshing", label: "Remeshing", icon: Grid3x3, description: "Optimize mesh topology" },
    { id: "styling", label: "Stylizing", icon: Sparkles, description: "Apply artistic styles and effects" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {/* Asset Management Sidebar */}
          <AssetSidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-primary" />
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">Formverse Studio</h1>
                    <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </header>

            {/* Workflow Tabs */}
            <div className="border-b border-border bg-card/30">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-4 lg:w-2/3 xl:w-1/2">
                    {workflowStages.map((stage) => (
                      <TabsTrigger 
                        key={stage.id} 
                        value={stage.id}
                        className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        <stage.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{stage.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Stage Description */}
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground mt-2">
                    {workflowStages.find(s => s.id === activeTab)?.description}
                  </p>
                </div>

                {/* Central Input Area */}
                {activeTab === "generation" && (
                  <div className="px-6 pb-6">
                    <Card className="bg-muted/30 border-dashed">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex bg-muted rounded-lg p-1">
                            <Button
                              variant={inputMode === 'text' ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setInputMode('text')}
                              className="flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Text Prompt
                            </Button>
                            <Button
                              variant={inputMode === 'image' ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setInputMode('image')}
                              className="flex items-center gap-2"
                            >
                              <Camera className="w-4 h-4" />
                              Image Upload
                            </Button>
                          </div>
                        </div>

                        {inputMode === 'text' ? (
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Describe the 3D model you want to create... (e.g., 'A futuristic robot with LED lights and metallic finish')"
                              value={textPrompt}
                              onChange={(e) => setTextPrompt(e.target.value)}
                              className="min-h-[120px] resize-none bg-background/50"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="w-4 h-4" />
                                <span>AI will analyze and optimize your prompt</span>
                              </div>
                              <Button disabled={!textPrompt.trim()}>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Generate
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-4">
                                  {selectedFile ? (
                                    <>
                                      <Image className="w-12 h-12 text-primary" />
                                      <div>
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">Click to change image</p>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-12 h-12 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium">Drop your image here</p>
                                        <p className="text-sm text-muted-foreground">Or click to browse files</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                <span>AI will analyze image structure and depth</span>
                              </div>
                              <Button disabled={!selectedFile}>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Convert to 3D
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Workspace Content */}
                <div className="flex-1">
                  <TabsContent value="generation" className="mt-0 h-full">
                    <GenerationWorkspace />
                  </TabsContent>
                  
                  <TabsContent value="texturing" className="mt-0 h-full">
                    <TexturingWorkspace />
                  </TabsContent>
                  
                  <TabsContent value="remeshing" className="mt-0 h-full">
                    <RemeshingWorkspace />
                  </TabsContent>
                  
                  <TabsContent value="styling" className="mt-0 h-full">
                    <StylingWorkspace />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default FormverseStudio;