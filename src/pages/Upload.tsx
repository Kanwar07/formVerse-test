
import { useState, useEffect } from "react";
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
import { 
  Brain, 
  Check, 
  ChevronRight, 
  Loader2, 
  Upload as UploadIcon, 
  Info,
  FileCheck, 
  FileX,
  Printer,
  Settings
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FormIQInsight } from "@/components/formiq/FormIQInsight";

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
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  // FormIQ Analysis Results
  const [printabilityScore, setPrintabilityScore] = useState(0);
  const [materialRecommendations, setMaterialRecommendations] = useState<string[]>([]);
  const [printingTechniques, setPrintingTechniques] = useState<string[]>([]);
  const [designIssues, setDesignIssues] = useState<{issue: string, severity: string}[]>([]);
  const [oemCompatibility, setOemCompatibility] = useState<{name: string, score: number}[]>([]);
  const [marketDemand, setMarketDemand] = useState<{category: string, value: number}[]>([]);

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
            // Generate FormIQ analysis results
            runFormIQAnalysis();
            
            // Set tags
            setAiGeneratedTags([
              "industrial", 
              "gear", 
              "mechanical", 
              "engineering", 
              "precision", 
              "manufacturing"
            ]);
            
            setAnalyzing(false);
            setAnalysisComplete(true);
            setCurrentStep(2);
          }, 2500);
        }
      }, 200);
    }
  };

  // FormIQ Analysis simulation
  const runFormIQAnalysis = () => {
    // Simulate printability score calculation
    const score = Math.floor(Math.random() * 25) + 75; // 75-100 range
    setPrintabilityScore(score);

    // Simulate material recommendations
    setMaterialRecommendations([
      "PLA - Good for detailed features", 
      "PETG - Better durability", 
      "ABS - Heat resistant option"
    ]);

    // Simulate printing techniques
    setPrintingTechniques([
      "FDM - Standard printing", 
      "SLA - For high precision", 
      "SLS - For complex geometry"
    ]);

    // Simulate design issues detection
    setDesignIssues([
      { issue: "Thin walls in section A-2", severity: "Medium" },
      { issue: "Sharp interior corners", severity: "Low" },
      { issue: "Unsupported overhangs", severity: "High" }
    ]);

    // Simulate OEM compatibility
    setOemCompatibility([
      { name: "Prusa", score: 95 },
      { name: "Creality", score: 88 },
      { name: "Ultimaker", score: 92 },
      { name: "Anycubic", score: 86 }
    ]);

    // Simulate market demand analysis
    setMarketDemand([
      { category: "Engineering", value: 85 },
      { category: "Mechanical Parts", value: 78 },
      { category: "Industrial Equipment", value: 92 }
    ]);

    // Adjust suggested price based on analysis
    const newPrice = Math.floor((1500 + (score * 25)) / 100) * 100; // Base price adjusted by score
    setSuggestedPrice(newPrice);
    setActualPrice(newPrice);
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
                  <div className="mt-6 w-full max-w-xl">
                    <div className="flex items-center mb-4">
                      <Brain className="h-5 w-5 text-primary animate-pulse mr-2" />
                      <span className="font-medium">FormIQ is analyzing your model...</span>
                    </div>
                    <div className="space-y-2">
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

                {/* FormIQ Analysis Results */}
                {analysisComplete && (
                  <div className="mt-6 w-full">
                    <div className="flex items-center mb-4">
                      <Brain className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">FormIQ Analysis Results</span>
                    </div>
                    
                    <Card className="mb-4 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-between">
                        <h3 className="font-medium">Printability Score</h3>
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${printabilityScore >= 90 ? 'text-emerald-500' : printabilityScore >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                            {printabilityScore}/100
                          </span>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <Progress 
                          value={printabilityScore} 
                          className="h-2 mb-4"
                          indicatorClassName={`${printabilityScore >= 90 ? 'bg-emerald-500' : printabilityScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg bg-muted/30">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <FileCheck className="h-4 w-4 mr-2 text-emerald-500" />
                              OEM Compatibility
                            </h4>
                            <div className="space-y-2">
                              {oemCompatibility.map((oem, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span>{oem.name}</span>
                                  <span className={`${oem.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {oem.score}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-muted/30">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Settings className="h-4 w-4 mr-2 text-primary" />
                              Material Recommendations
                            </h4>
                            <ul className="text-xs space-y-1">
                              {materialRecommendations.map((material, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-primary/70 mr-2"></span>
                                  {material}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-muted/30">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <FileX className="h-4 w-4 mr-2 text-red-500" />
                              Design Issues
                            </h4>
                            <ul className="text-xs space-y-1">
                              {designIssues.map((issue, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{issue.issue}</span>
                                  <Badge variant={issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "default" : "outline"} className="text-[10px] py-0 h-4">
                                    {issue.severity}
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center"
                          >
                            Continue with analysis
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
                
                {/* FormIQ Insights */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>FormIQ Insights</Label>
                    <span className="text-xs flex items-center">
                      <Brain className="h-3 w-3 text-primary mr-1" />
                      AI-generated insights
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormIQInsight
                      title="Market Analysis"
                      content="This model has high demand in the engineering and industrial sectors."
                      icon={<Info className="h-4 w-4 text-primary" />}
                      metrics={[
                        { label: "Market Demand", value: "High" },
                        { label: "Target Industries", value: "Engineering, Manufacturing" }
                      ]}
                    />
                    
                    <FormIQInsight
                      title="Printing Techniques"
                      content="Optimal results with FDM printing using 0.1mm layer height."
                      icon={<Printer className="h-4 w-4 text-primary" />}
                      metrics={[
                        { label: "Recommended Technique", value: "FDM" },
                        { label: "Alternative", value: "SLA for detail" }
                      ]}
                    />
                  </div>
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
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
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
                    <Brain className="h-3 w-3 text-primary mr-1 mt-0.5 inline" />
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
                        <span className="text-sm font-medium">{printabilityScore}/100</span>
                      </div>
                      <Progress value={printabilityScore} className="h-2" />
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">AI Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mt-1">
                        <li>Model is optimized for {printingTechniques[0]?.split(" - ")[0] || "FDM"} printing</li>
                        <li>Compatible with {materialRecommendations.slice(0, 2).map(m => m.split(" - ")[0]).join(", ")} materials</li>
                        {designIssues.length > 0 && (
                          <li>Consider fixing {designIssues.filter(i => i.severity === "High").length} high-priority design issues</li>
                        )}
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
