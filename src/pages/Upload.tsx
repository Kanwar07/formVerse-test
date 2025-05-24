
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/components/ui/use-toast";

// Import refactored components
import { FileUploader } from "@/components/upload/FileUploader";
import { FormIQAnalyzer } from "@/components/upload/FormIQAnalyzer";
import { Stepper } from "@/components/upload/Stepper";
import { DetailsForm } from "@/components/upload/DetailsForm";
import { PricingForm } from "@/components/upload/PricingForm";
import { ReviewForm } from "@/components/upload/ReviewForm";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(1999);
  const [actualPrice, setActualPrice] = useState(1999);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  // FormIQ Analysis Results
  const [printabilityScore, setPrintabilityScore] = useState(0);
  const [materialRecommendations, setMaterialRecommendations] = useState<string[]>([]);
  const [printingTechniques, setPrintingTechniques] = useState<string[]>([]);
  const [designIssues, setDesignIssues] = useState<{issue: string, severity: string}[]>([]);
  const [oemCompatibility, setOemCompatibility] = useState<{name: string, score: number}[]>([]);
  const [marketDemand, setMarketDemand] = useState<{category: string, value: number}[]>([]);

  const handleFileSelected = (file: File) => {
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
        <Stepper currentStep={currentStep} />
        
        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <FileUploader 
                  onFileSelected={handleFileSelected} 
                  uploadProgress={uploadProgress} 
                />
                
                <FormIQAnalyzer 
                  analyzing={analyzing}
                  analysisComplete={analysisComplete}
                  printabilityScore={printabilityScore}
                  materialRecommendations={materialRecommendations}
                  printingTechniques={printingTechniques}
                  designIssues={designIssues}
                  oemCompatibility={oemCompatibility}
                  onContinue={() => setCurrentStep(2)}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Details & Tags */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <DetailsForm 
                aiGeneratedTags={aiGeneratedTags}
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Pricing & License */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <PricingForm 
                suggestedPrice={suggestedPrice}
                onBack={() => setCurrentStep(2)}
                onContinue={() => setCurrentStep(4)}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Step 4: Review & Publish */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="pt-6">
              <ReviewForm 
                printabilityScore={printabilityScore}
                printingTechniques={printingTechniques}
                materialRecommendations={materialRecommendations}
                designIssues={designIssues}
                actualPrice={actualPrice}
                onBack={() => setCurrentStep(3)}
                onSubmit={handleSubmit}
              />
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

// Add missing import
import { Brain } from "lucide-react";
