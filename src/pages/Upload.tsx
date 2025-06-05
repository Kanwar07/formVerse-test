import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/components/ui/use-toast";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormIQAnalysisResult } from "@/services/formiq";

// Import refactored components
import { FileUploader } from "@/components/upload/FileUploader";
import { FormIQAnalyzer } from "@/components/upload/FormIQAnalyzer";
import { Stepper } from "@/components/upload/Stepper";
import { DetailsForm } from "@/components/upload/DetailsForm";
import { MetadataForm, ModelMetadata } from "@/components/upload/MetadataForm";
import { PricingForm } from "@/components/upload/PricingForm";
import { ReviewForm } from "@/components/upload/ReviewForm";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPath, setModelPath] = useState<string | undefined>(undefined);
  const [modelName, setModelName] = useState<string>("");
  const [modelDescription, setModelDescription] = useState<string>("");
  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | null>(null);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(1999);
  const [actualPrice, setActualPrice] = useState(1999);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [licenseType, setLicenseType] = useState<string>("commercial");
  const { toast } = useToast();
  const navigate = useNavigate();

  // FormIQ Analysis Results
  const [printabilityScore, setPrintabilityScore] = useState(0);
  const [materialRecommendations, setMaterialRecommendations] = useState<string[]>([]);
  const [printingTechniques, setPrintingTechniques] = useState<string[]>([]);
  const [designIssues, setDesignIssues] = useState<{issue: string, severity: string}[]>([]);
  const [oemCompatibility, setOemCompatibility] = useState<{name: string, score: number}[]>([]);

  const handleFileSelected = (file: File, filePath: string) => {
    setModelFile(file);
    setModelPath(filePath);
    setModelName(file.name.split('.')[0]);
    setAnalyzing(true);

    // Generate SHA hash for file tracking
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Store file hash for tracking
      localStorage.setItem(`file_hash_${filePath}`, hashHex);
      console.log('File hash stored:', hashHex);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle FormIQ analysis completion
  const handleAnalysisComplete = (result: FormIQAnalysisResult) => {
    setPrintabilityScore(result.printabilityScore);
    setMaterialRecommendations(result.materialRecommendations);
    setPrintingTechniques(result.printingTechniques);
    setDesignIssues(result.designIssues);
    setOemCompatibility(result.oemCompatibility);
    
    // Generate tags based on analysis
    setAiGeneratedTags([
      "industrial", 
      "gear", 
      "mechanical", 
      "engineering", 
      "precision", 
      "manufacturing"
    ]);
    
    // Set suggested price based on analysis
    const newPrice = Math.floor((1500 + (result.printabilityScore * 25)) / 100) * 100;
    setSuggestedPrice(newPrice);
    setActualPrice(newPrice);
    
    setAnalyzing(false);
    setAnalysisComplete(true);
    setCurrentStep(2);
  };

  // Handle metadata submission
  const handleMetadataSubmit = (metadata: ModelMetadata) => {
    setModelMetadata(metadata);
    setCurrentStep(3);
  };

  // Handle model details submission
  const handleDetailsSubmit = (name: string, description: string, tags: string[]) => {
    setModelName(name);
    setModelDescription(description);
    setCustomTags(tags);
    setCurrentStep(4);
  };

  // Handle pricing submission
  const handlePricingSubmit = (price: number, license: string) => {
    setActualPrice(price);
    setLicenseType(license);
    setCurrentStep(5);
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!modelPath || !modelMetadata) {
      toast({
        title: "Error",
        description: "Missing required model data",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create comprehensive model data
      const modelData = {
        name: modelName,
        description: modelDescription,
        file_path: modelPath,
        metadata: modelMetadata,
        tags: [...aiGeneratedTags, ...customTags],
        price: actualPrice,
        license_type: licenseType,
        printability_score: printabilityScore,
        material_recommendations: materialRecommendations,
        design_issues: designIssues,
        oem_compatibility: oemCompatibility,
        upload_timestamp: new Date().toISOString()
      };

      // Store in localStorage for demo purposes
      const existingModels = JSON.parse(localStorage.getItem('uploaded_models') || '[]');
      existingModels.push(modelData);
      localStorage.setItem('uploaded_models', JSON.stringify(existingModels));

      toast({
        title: "Model uploaded successfully!",
        description: "Your model has been uploaded with comprehensive metadata and is ready for review.",
      });
      
      // Redirect to discover page after successful upload
      setTimeout(() => {
        navigate("/discover");
      }, 2000);
    } catch (error) {
      console.error("Error publishing model:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while publishing your model. Please try again.",
        variant: "destructive"
      });
    }
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
          <p className="text-muted-foreground">Let FormIQ analyze your model and provide AI-powered suggestions with comprehensive metadata collection.</p>
        </div>
        
        {/* Stepper - Updated for new flow */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Upload & Analysis" },
              { step: 2, label: "Metadata" },
              { step: 3, label: "Details & Tags" },
              { step: 4, label: "Pricing" },
              { step: 5, label: "Review" }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= item.step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.step}
                </div>
                <span className={`ml-2 text-sm ${currentStep >= item.step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {index < 4 && (
                  <div className={`w-12 h-px mx-4 ${currentStep > item.step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step 1: File Upload & Analysis */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <FileUploader 
                  onFileSelected={handleFileSelected} 
                  uploadProgress={uploadProgress} 
                  setUploadProgress={setUploadProgress}
                />
                
                <FormIQAnalyzer 
                  analyzing={analyzing}
                  analysisComplete={analysisComplete}
                  modelPath={modelPath}
                  modelName={modelName}
                  printabilityScore={printabilityScore}
                  materialRecommendations={materialRecommendations}
                  printingTechniques={printingTechniques}
                  designIssues={designIssues}
                  oemCompatibility={oemCompatibility}
                  onContinue={() => setCurrentStep(2)}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Metadata Collection */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <MetadataForm 
                onBack={() => setCurrentStep(1)}
                onContinue={handleMetadataSubmit}
                initialData={modelMetadata || undefined}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Details & Tags */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <DetailsForm 
                aiGeneratedTags={aiGeneratedTags}
                onBack={() => setCurrentStep(2)}
                onContinue={(name, description, tags) => {
                  handleDetailsSubmit(name, description, tags);
                }}
                initialName={modelName}
                initialDescription={modelDescription}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Step 4: Pricing & License */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="pt-6">
              <PricingForm 
                suggestedPrice={suggestedPrice}
                onBack={() => setCurrentStep(3)}
                onContinue={(price, license) => {
                  handlePricingSubmit(price, license);
                }}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Step 5: Review & Publish */}
        {currentStep === 5 && (
          <Card>
            <CardContent className="pt-6">
              <ReviewForm 
                printabilityScore={printabilityScore}
                printingTechniques={printingTechniques}
                materialRecommendations={materialRecommendations}
                designIssues={designIssues}
                actualPrice={actualPrice}
                onBack={() => setCurrentStep(4)}
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
