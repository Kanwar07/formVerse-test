import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Brain, Check, ChevronRight, Loader2, Upload as UploadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState(1999);
  const [actualPrice, setActualPrice] = useState(1999);
  const [priceOverridden, setPriceOverridden] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setAnalyzing(true);
          
          // Simulate AI analysis
          setTimeout(() => {
            setAnalyzing(false);
            setAiGeneratedTags([
              "industrial", 
              "gear", 
              "mechanical", 
              "engineering", 
              "precision", 
              "manufacturing"
            ]);
            setCurrentStep(2);
          }, 2500);
        }
      }, 200);
    }
  };

  const handleAddTag = () => {
    if (newTag && !customTags.includes(newTag) && !aiGeneratedTags.includes(newTag)) {
      setCustomTags([...customTags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const handlePriceChange = (value: number[]) => {
    setActualPrice(value[0]);
    setPriceOverridden(true);
  };

  const handleSubmit = () => {
    toast({
      title: "Model uploaded successfully!",
      description: "Your model has been uploaded and is now being reviewed.",
    });
    
    // Redirect to dashboard after successful upload
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mb-1">Upload New Model</h1>
            <div className="ml-3 px-2 py-1 rounded-md bg-gradient-to-r from-[hsl(var(--formiq-blue)/10)] to-[hsl(var(--formiq-purple)/10)] flex items-center">
              <Brain className="h-4 w-4 text-primary mr-1" />
              <span className="text-xs font-medium formiq-gradient-text">FormIQ Enhanced</span>
            </div>
          </div>
          <p className="text-muted-foreground">Let FormIQ analyze your model and provide AI-powered suggestions.</p>
        </div>
        
        {/* Stepper */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted"></div>
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <p className="mt-2 text-sm font-medium">Upload</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <p className="mt-2 text-sm font-medium">Details & Tags</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
              </div>
              <p className="mt-2 text-sm font-medium">Pricing & License</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                "4"
              </div>
              <p className="mt-2 text-sm font-medium">Review & Publish</p>
            </div>
          </div>
        </div>
        
        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 w-full max-w-xl flex flex-col items-center justify-center text-center">
                  <UploadIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Upload your 3D model</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supported formats: STL, OBJ, STEP (Max 50MB)
                  </p>
                  <Input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    accept=".stl,.obj,.step" 
                    onChange={handleFileChange}
                  />
                  <Label 
                    htmlFor="file-upload" 
                    className="bg-primary text-primary-foreground py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Select File
                  </Label>
                  {modelFile && (
                    <p className="mt-4 text-sm">
                      Selected: {modelFile.name}
                    </p>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-6 w-full max-w-xl">
                    <p className="text-sm mb-2">Uploading... {uploadProgress}%</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {analyzing && (
                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="font-medium">FormIQ is analyzing your model...</span>
                    </div>
                    <div className="space-y-2 max-w-xl mx-auto">
                      <div className="p-3 rounded-lg bg-muted/30 flex items-center">
                        <Check className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-sm">Analyzing mesh topology...</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 flex items-center">
                        <Check className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-sm">Identifying key features...</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 flex items-center animate-pulse">
                        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                        <span className="text-sm">Calculating printability score...</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 flex items-center opacity-50">
                        <div className="h-4 w-4 mr-2"></div>
                        <span className="text-sm">Generating optimal tags...</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 flex items-center opacity-50">
                        <div className="h-4 w-4 mr-2"></div>
                        <span className="text-sm">Creating pricing recommendations...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Details & Tags */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input id="model-name" placeholder="Enter a descriptive name for your model" />
                </div>
                
                <div>
                  <Label htmlFor="model-description">Description</Label>
                  <Textarea 
                    id="model-description" 
                    placeholder="Describe your model, its features, and potential use cases..." 
                    className="min-h-[120px]"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Tags</Label>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Brain className="h-3 w-3 text-primary mr-1" />
                      AI-generated + custom tags
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aiGeneratedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                        {tag}
                        <span className="ml-1 text-xs">(AI)</span>
                      </Badge>
                    ))}
                    
                    {customTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex gap-2">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add custom tag..." 
                      value={newTag} 
                      onChange={(e) => setNewTag(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button variant="outline" onClick={handleAddTag}>Add</Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">Back</Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Pricing & License */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <Label>Price (₹)</Label>
                      <div className="text-lg font-semibold">₹{actualPrice}</div>
                    </div>
                    <div className="text-sm">
                      {priceOverridden ? (
                        <span className="text-muted-foreground flex items-center">
                          <Brain className="h-3 w-3 text-primary mr-1" />
                          AI suggested: ₹{suggestedPrice}
                        </span>
                      ) : (
                        <span className="flex items-center text-primary">
                          <Check className="mr-1 h-4 w-4" />
                          AI suggested price
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <Slider 
                      defaultValue={[suggestedPrice]} 
                      max={10000} 
                      step={100}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹500</span>
                      <span>₹5,000</span>
                      <span>₹10,000</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    <Brain className="h-3 w-3 text-primary mr-1 mt-0.5" />
                    FormIQ pricing is based on similar models in our marketplace and considers complexity, 
                    detail, and market demand.
                  </p>
                </div>
                
                <div>
                  <Label>License Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="border rounded-md p-4 cursor-pointer hover:border-primary">
                      <h4 className="font-medium">Standard</h4>
                      <p className="text-sm text-muted-foreground">Personal and small business use</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover:border-primary bg-primary/5 border-primary">
                      <h4 className="font-medium">Commercial</h4>
                      <p className="text-sm text-muted-foreground">Unlimited commercial production</p>
                      <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary text-xs">AI Recommended</Badge>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover:border-primary">
                      <h4 className="font-medium">Extended</h4>
                      <p className="text-sm text-muted-foreground">Includes source files & modifications</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Additional License Terms</Label>
                  <Textarea 
                    placeholder="Any additional license terms or restrictions..."
                    className="mt-2 min-h-[80px]"
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 4: Review & Publish */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-muted p-4">
                    <h3 className="font-semibold">Model Preview</h3>
                  </div>
                  <div className="p-6 flex flex-col items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
                      alt="Model Preview" 
                      className="h-48 w-auto mb-4 object-contain"
                    />
                    <Button variant="outline" size="sm">View 3D Preview</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Model Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">Industrial Gear Assembly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Type:</span>
                        <span className="font-medium">STL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-medium">24.3 MB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Pricing & License</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">₹{actualPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License:</span>
                        <span className="font-medium">Commercial</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee:</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-xl p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">FormIQ Analysis Results</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Printability Score</span>
                        <span className="text-sm font-medium">92/100</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">AI Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mt-1">
                        <li>Model is optimized for FDM printing</li>
                        <li>Compatible with ABS, PLA, and PETG materials</li>
                        <li>Consider thickening thin walls at highlighted areas</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4" size="sm" asChild>
                    <Link to={`/printability/model-1`}>View Full Report</Link>
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                  <Button onClick={handleSubmit}>Publish Model</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Upload;
