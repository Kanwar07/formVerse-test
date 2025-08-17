import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Upload as UploadIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormIQAnalysisResult } from "@/services/formiq";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ModelInsightsService } from "@/services/modelInsights";

// Import refactored components
import { FileUploader } from "@/components/upload/FileUploader";
import { ImageToCADUploader } from "@/components/upload/ImageToCADUploader";
import { FormIQAnalyzer } from "@/components/upload/FormIQAnalyzer";
import { Stepper } from "@/components/upload/Stepper";
import { DetailsForm } from "@/components/upload/DetailsForm";
import { MetadataForm, ModelMetadata } from "@/components/upload/MetadataForm";
import { PricingForm } from "@/components/upload/PricingForm";
import { ReviewForm } from "@/components/upload/ReviewForm";
import { ModelPreview } from "@/components/preview/ModelPreview";
import { useThumbnailGenerator } from "@/hooks/useThumbnailGenerator";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPath, setModelPath] = useState<string | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | null>(null);
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(1999);
  const [actualPrice, setActualPrice] = useState(1999);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [licenseType, setLicenseType] = useState<string>("commercial");
  
  // Add missing state variables
  const [modelName, setModelName] = useState<string>("");
  const [modelDescription, setModelDescription] = useState<string>("");
  const [qualityStatus, setQualityStatus] = useState<'approved' | 'declined' | 'reviewing'>('reviewing');
  const [qualityNotes, setQualityNotes] = useState<string>("");
  
  // Upload method tracking
  const [uploadMethod, setUploadMethod] = useState<'file' | 'image'>('file');
  const [sourceImagePath, setSourceImagePath] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // FormIQ Analysis Results
  const [printabilityScore, setPrintabilityScore] = useState(0);
  const [materialRecommendations, setMaterialRecommendations] = useState<string[]>([]);
  const [printingTechniques, setPrintingTechniques] = useState<string[]>([]);
  const [designIssues, setDesignIssues] = useState<{issue: string, severity: string}[]>([]);
  const [oemCompatibility, setOemCompatibility] = useState<{name: string, score: number}[]>([]);

  // Add thumbnail generation state
  const { isGenerating: thumbnailGenerating, thumbnailUrl, generateThumbnail, setThumbnailUrl } = useThumbnailGenerator();

  // Generate file URL for preview
  const getFileUrl = () => {
    if (!modelPath) return undefined;
    const { data } = supabase.storage.from('3d-models').getPublicUrl(modelPath);
    console.log('Generated file URL for preview:', data.publicUrl);
    return data.publicUrl;
  };

  const handleFileSelected = async (file: File, filePath: string, extractedFileInfo: any, sourceImage?: string) => {
    console.log('=== FILE SELECTED ===');
    console.log('File:', file.name);
    console.log('File Path:', filePath);
    console.log('File Info:', extractedFileInfo);
    console.log('Source Image:', sourceImage);
    
    setModelFile(file);
    setModelPath(filePath);
    setFileInfo(extractedFileInfo);
    setModelName(file.name.split('.')[0]);
    setAnalyzing(true);
    
    // Store source image path if this model was generated from an image
    if (sourceImage) {
      setSourceImagePath(sourceImage);
      setUploadMethod('image');
    } else {
      setUploadMethod('file');
    }

    // Reset thumbnail state
    setThumbnailUrl(null);

    // Get the public URL for the uploaded file
    const fileUrl = supabase.storage.from('3d-models').getPublicUrl(filePath).data.publicUrl;
    console.log('Public file URL for thumbnail generation:', fileUrl);

    // Start thumbnail generation with increased timeout for CAD files
    if (user && fileUrl) {
      console.log('Starting enhanced thumbnail generation for CAD file...');
      try {
        // Add a small delay to ensure file is fully uploaded and accessible
        setTimeout(async () => {
          const thumbnailUrl = await generateThumbnail(fileUrl, file.name, file.type, user.id);
          if (thumbnailUrl) {
            console.log('CAD thumbnail generated successfully:', thumbnailUrl);
            toast({
              title: "Model preview ready!",
              description: "Your CAD model preview has been generated successfully.",
            });
          }
        }, 2000); // 2 second delay for file propagation
      } catch (error) {
        console.error('Thumbnail generation failed:', error);
      }
    }

    // Generate SHA hash for file tracking
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log('File hash stored:', hashHex);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAnalysisComplete = (result: FormIQAnalysisResult) => {
    setPrintabilityScore(result.printabilityScore);
    setMaterialRecommendations(result.materialRecommendations);
    setPrintingTechniques(result.printingTechniques);
    setDesignIssues(result.designIssues);
    setOemCompatibility(result.oemCompatibility);
    setQualityStatus(result.qualityStatus);
    setQualityNotes(result.qualityNotes || '');
    
    // Generate insights and tags based on model name and description
    const insights = ModelInsightsService.generateInsights(modelName, modelDescription);
    setAiGeneratedTags(insights.tags);
    
    // Update material recommendations and printing techniques with generated insights
    setMaterialRecommendations([...result.materialRecommendations, ...insights.materialRecommendations]);
    setPrintingTechniques([...result.printingTechniques, ...insights.printingTechniques]);
    
    // Set suggested price based on analysis
    const newPrice = Math.floor((1500 + (result.printabilityScore * 25)) / 100) * 100;
    setSuggestedPrice(newPrice);
    setActualPrice(newPrice);
    
    setAnalyzing(false);
    setAnalysisComplete(true);
    
    // Only proceed to next step if approved
    if (result.qualityStatus === 'approved') {
      setCurrentStep(2);
    }
  };

  // Handle metadata submission
  const handleMetadataSubmit = (metadata: ModelMetadata) => {
    setModelMetadata(metadata);
    setCurrentStep(4);
  };

  // Handle model details submission
  const handleDetailsSubmit = (name: string, description: string, tags: string[]) => {
    setModelName(name);
    setModelDescription(description);
    setCustomTags(tags);
    
    // Regenerate insights based on updated name and description
    const insights = ModelInsightsService.generateInsights(name, description);
    setAiGeneratedTags(insights.tags);
    
    setCurrentStep(3);
  };

  // Handle pricing submission
  const handlePricingSubmit = (price: number, license: string) => {
    setActualPrice(price);
    setLicenseType(license);
    setCurrentStep(5);
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!modelPath || !modelMetadata || !modelFile) {
      toast({
        title: "Error",
        description: "Missing required model data",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your model.",
          variant: "destructive"
        });
        return;
      }

      // Determine category from metadata and tags
      const category = modelMetadata.industry.toLowerCase();
      const insights = ModelInsightsService.generateInsights(modelName, modelDescription);
      const allTags = [...insights.tags, ...customTags];

      // Create model record in database with all required fields
      const { data: modelData, error: modelError } = await supabase
        .from('models')
        .insert({
          user_id: user.id,
          name: modelName,
          description: modelDescription,
          file_path: modelPath,
          file_size: modelFile.size,
          file_type: modelFile.type || fileInfo?.type,
          tags: allTags,
          price: actualPrice / 100, // Convert from cents to dollars
          license_type: licenseType,
          printability_score: printabilityScore,
          material_recommendations: materialRecommendations,
          printing_techniques: printingTechniques,
          design_issues: designIssues,
          oem_compatibility: oemCompatibility,
          preview_image: thumbnailUrl,
          status: 'draft', // Initially not public to hirers
          category: category,
          difficulty_level: modelMetadata.complexity,
          view_count: 0,
          downloads: 0,
          quality_status: qualityStatus,
          quality_checked_at: new Date().toISOString(),
          quality_notes: qualityNotes
        })
        .select()
        .single();

      if (modelError) {
        console.error("Error creating model:", modelError);
        toast({
          title: "Upload failed",
          description: modelError.message || "An error occurred while saving your model. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Model created successfully:', modelData);

      // Save FormIQ analysis
      const { error: analysisError } = await supabase
        .from('formiq_analyses')
        .insert({
          model_id: modelData.id,
          printability_score: printabilityScore,
          material_recommendations: materialRecommendations,
          printing_techniques: printingTechniques,
          design_issues: designIssues,
          oem_compatibility: oemCompatibility
        });

      if (analysisError) {
        console.error("Error saving analysis:", analysisError);
        // Don't fail the whole operation if analysis save fails
      }

      toast({
        title: "Model uploaded successfully!",
        description: "Your model has been uploaded and is now available in the marketplace.",
      });
      
      // Redirect to creator dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard');
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
          <p className="text-muted-foreground">Let FormIQ analyze your CAD model and provide AI-powered suggestions with accurate 3D preview generation.</p>
        </div>
        
        {/* Stepper - Updated for new flow */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Upload & Analysis" },
              { step: 2, label: "Model Details" },
              { step: 3, label: "Metadata" },
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
        
        {/* Show file preview after upload */}
        {modelFile && fileInfo && modelPath && (
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">CAD Model Preview</h3>
                
                {thumbnailGenerating && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <div>
                        <span className="text-sm font-medium text-blue-800">Generating accurate CAD model preview...</span>
                        <p className="text-xs text-blue-600 mt-1">Analyzing geometry and creating 3D visualization</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <ModelPreview
                  modelName={modelName}
                  thumbnail={thumbnailUrl || '/placeholder.svg'}
                  fileUrl={getFileUrl()}
                  fileName={modelFile.name}
                  fileType={modelFile.name.split('.').pop()?.toLowerCase() || ''}
                  isOwner={true}
                />
                
                
                {thumbnailUrl && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-800 font-medium">CAD model preview generated successfully!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Step 1: Upload & Analysis */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">
                    <div className="flex items-center gap-2">
                      <UploadIcon className="h-4 w-4" />
                      Upload 3D Model
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="generate">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate from Image
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-6">
                  <div className="flex flex-col items-center">
                    <FileUploader 
                      onFileSelected={handleFileSelected} 
                      uploadProgress={uploadProgress} 
                      setUploadProgress={setUploadProgress}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="generate" className="space-y-6">
                  <div className="flex flex-col items-center">
                    <ImageToCADUploader 
                      onModelGenerated={handleFileSelected}
                      uploading={imageUploading}
                      setUploading={setImageUploading}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Show file info after upload */}
              {fileInfo && (
                <div className="mt-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">
                      {uploadMethod === 'image' ? 'Generated Model Information' : 'CAD File Information Gathered'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                      <div><strong>File:</strong> {fileInfo.name}</div>
                      <div><strong>Size:</strong> {fileInfo.sizeFormatted}</div>
                      <div><strong>Format:</strong> {fileInfo.extension?.toUpperCase()}</div>
                      <div><strong>Method:</strong> {uploadMethod === 'image' ? 'AI Generated' : 'Direct Upload'}</div>
                    </div>
                    {uploadMethod === 'image' && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <span className="flex items-center text-blue-800">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generated using CADQUA AI from uploaded image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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
            </CardContent>
          </Card>
        )}
        
        {/* Step 2: Model Name & Details (MOVED TO FRONT) */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <DetailsForm 
                aiGeneratedTags={aiGeneratedTags}
                onBack={() => setCurrentStep(1)}
                onContinue={(name, description, tags) => {
                  handleDetailsSubmit(name, description, tags);
                }}
                initialName={modelName}
                initialDescription={modelDescription}
                required={true}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3: Metadata Collection */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <MetadataForm 
                onBack={() => setCurrentStep(2)}
                onContinue={handleMetadataSubmit}
                initialData={modelMetadata || undefined}
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
                modelFile={modelFile}
                modelName={modelName}
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
