import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Upload as UploadIcon,
  Sparkles,
  Lightbulb,
  Info,
  Type,
  Image,
  Upload,
  History,
  Radio,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormIQAnalysisResult } from "@/services/formiq";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ModelInsightsService } from "@/services/modelInsights";

import { FileUploader } from "@/components/upload/FileUploader";
import { ImageToCADUploader } from "@/components/upload/ImageToCADUploader";
import { FormIQAnalyzer } from "@/components/upload/FormIQAnalyzer";
import { Stepper } from "@/components/upload/Stepper";
import { DetailsForm } from "@/components/upload/DetailsForm";
import { MetadataForm, ModelMetadata } from "@/components/upload/MetadataForm";
import { PricingForm } from "@/components/upload/PricingForm";
import { ReviewForm } from "@/components/upload/ReviewForm";
import { ModelPreview } from "@/components/preview/ModelPreview";
import { UnifiedCADViewer } from "@/components/preview/UnifiedCADViewer";
import { useThumbnailGenerator } from "@/hooks/useThumbnailGenerator";
import heroBackground from "@/assets/landing/heroSection/heroBackground.webp";
import { motion, AnimatePresence } from "framer-motion";

import Input from "../common/TextArea";
import TextArea from "../common/TextArea";
import Button from "../common/Button";
import TextToCADFlow from "./components/TextToCADFlow";
import ImageToCADFlow from "./components/ImageToCADFlow";
import ModalToCADFlow from "./components/ModalToCADFlow";
import HistoryCADFlow from "./components/HistoryCADFlow";
import Loading from "./components/Loading";
import TextToCAD from "./components/TextToCAD/TextToCAD";
import UploadToCAD from "./components/UploadToCAD/UploadToCAD";
import ImageToCAD from "./components/ImageToCAD/ImageToCAD";
import PrintAndDelivery from "./components/PrintAndDelivery/PrintAndDelivery";
import CreditPopUp from "./components/CreditPopUp/CreditPopUp";

const UploadPromptToCAD = () => {
  const [CADConvertWay, setCADConvertWay] = useState("text");
  const [loading, setLoading] = useState(false);
  const [showTextToCAD, setShowTextToCAD] = useState(false);
  const [showImageToCAD, setShowImageToCAD] = useState(false);
  const [showUploadToCAD, setShowUploadToCAD] = useState(false);

  const [quality, setQuality] = useState("");
  const [printAndDelivery, setPrintAndDelivery] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [creditPopUp, setCreditPopUp] = useState(false);

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPath, setModelPath] = useState<string | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | null>(
    null
  );
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(1999);
  const [actualPrice, setActualPrice] = useState(1999);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [licenseType, setLicenseType] = useState<string>("commercial");

  // Add missing state variables
  const [modelName, setModelName] = useState<string>("");
  const [modelDescription, setModelDescription] = useState<string>("");
  const [qualityStatus, setQualityStatus] = useState<
    "approved" | "declined" | "reviewing"
  >("reviewing");
  const [qualityNotes, setQualityNotes] = useState<string>("");

  // Background controls state for enhanced viewer
  const [background, setBackground] = useState<
    "white" | "grey" | "black" | "custom"
  >("white");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );

  // Upload method tracking
  const [uploadMethod, setUploadMethod] = useState<"file" | "image">("file");
  const [sourceImagePath, setSourceImagePath] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();

  // Determine default tab based on route
  const defaultTab =
    location.pathname === "/image-to-cad" ? "generate" : "upload";

  // FormIQ Analysis Results
  const [printabilityScore, setPrintabilityScore] = useState(0);
  const [materialRecommendations, setMaterialRecommendations] = useState<
    string[]
  >([]);
  const [printingTechniques, setPrintingTechniques] = useState<string[]>([]);
  const [designIssues, setDesignIssues] = useState<
    { issue: string; severity: string }[]
  >([]);
  const [oemCompatibility, setOemCompatibility] = useState<
    { name: string; score: number }[]
  >([]);

  // Add thumbnail generation state
  const {
    isGenerating: thumbnailGenerating,
    thumbnailUrl,
    generateThumbnail,
    setThumbnailUrl,
  } = useThumbnailGenerator();

  // Generate file URL for preview
  const getFileUrl = () => {
    if (!modelPath) return undefined;

    // Check if modelPath is a blob URL (created from proxy downloads)
    const isBlobUrl = modelPath.startsWith("blob:");

    // Check if modelPath is a Modal download URL
    const isModalUrl = modelPath.includes(
      "formversedude--cadqua-3d-api-fastapi-app.modal.run/download/"
    );

    // Check if it's already a complete URL (blob, modal, or any other external URL)
    const isCompleteUrl =
      modelPath.startsWith("http://") ||
      modelPath.startsWith("https://") ||
      isBlobUrl;

    if (isBlobUrl || isModalUrl || isCompleteUrl) {
      // For blob URLs, Modal URLs, or any complete URLs, use them directly
      console.log("Using direct URL for preview:", modelPath);
      return modelPath;
    } else {
      // For regular Supabase storage paths, get the public URL
      const { data } = supabase.storage
        .from("3d-models")
        .getPublicUrl(modelPath);
      console.log("Generated Supabase public URL for preview:", data.publicUrl);
      return data.publicUrl;
    }
  };

  const handleFileSelected = async (
    file: File,
    filePath: string,
    extractedFileInfo: any,
    sourceImage?: string,
    videoUrl?: string
  ) => {
    setModelFile(file);
    setModelPath(filePath);
    setFileInfo(extractedFileInfo);
    setModelName(file.name.split(".")[0]);
    setAnalyzing(true);

    // Store source image path if this model was generated from an image
    if (sourceImage) {
      setSourceImagePath(sourceImage);
      setUploadMethod("image");
    } else {
      setUploadMethod("file");
    }

    // Store video URL if provided (for AI-generated models)
    if (videoUrl) {
      setVideoUrl(videoUrl);
    }

    // Reset thumbnail state
    setThumbnailUrl(null);

    // Check if filePath is a blob URL, Modal URL, or complete URL
    const isBlobUrl = filePath.startsWith("blob:");
    const isModalUrl = filePath.includes(
      "formversedude--cadqua-3d-api-fastapi-app.modal.run/download/"
    );
    const isCompleteUrl =
      filePath.startsWith("http://") || filePath.startsWith("https://");
    let fileUrl: string;

    if (isBlobUrl) {
      // For blob URLs, skip thumbnail generation as they can't be accessed from workers
      console.log(
        "Blob URL detected, skipping 3D thumbnail generation (will use fallback)"
      );
      fileUrl = ""; // Empty string to skip thumbnail generation
    } else if (isModalUrl || isCompleteUrl) {
      // For Modal URLs or complete URLs, use them directly for thumbnail generation
      fileUrl = filePath;
      console.log("Using direct URL for thumbnail:", fileUrl);
    } else {
      // For regular Supabase storage paths, get the public URL
      fileUrl = supabase.storage.from("3d-models").getPublicUrl(filePath)
        .data.publicUrl;
      console.log("Public file URL for thumbnail generation:", fileUrl);
    }

    // Start thumbnail generation with increased timeout for CAD files (skip for blob URLs)
    if (user && fileUrl && !isBlobUrl) {
      console.log("Starting enhanced thumbnail generation for CAD file...");
      try {
        // Add a small delay to ensure file is fully uploaded and accessible
        setTimeout(async () => {
          const thumbnailUrl = await generateThumbnail(
            fileUrl,
            file.name,
            file.type,
            user.id
          );
          if (thumbnailUrl) {
            console.log("CAD thumbnail generated successfully:", thumbnailUrl);
            toast({
              title: "Model preview ready!",
              description:
                "Your CAD model preview has been generated successfully.",
            });
          }
        }, 2000); // 2 second delay for file propagation
      } catch (error) {
        console.error("Thumbnail generation failed:", error);
      }
    }

    // Generate SHA hash for file tracking
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("File hash stored:", hashHex);
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
    setQualityNotes(result.qualityNotes || "");

    // Generate insights and tags based on model name and description
    const insights = ModelInsightsService.generateInsights(
      modelName,
      modelDescription
    );
    setAiGeneratedTags(insights.tags);

    // Update material recommendations and printing techniques with generated insights
    setMaterialRecommendations([
      ...result.materialRecommendations,
      ...insights.materialRecommendations,
    ]);
    setPrintingTechniques([
      ...result.printingTechniques,
      ...insights.printingTechniques,
    ]);

    // Set suggested price based on analysis
    const newPrice =
      Math.floor((1500 + result.printabilityScore * 25) / 100) * 100;
    setSuggestedPrice(newPrice);
    setActualPrice(newPrice);

    setAnalyzing(false);
    setAnalysisComplete(true);

    // Only proceed to next step if approved
    if (result.qualityStatus === "approved") {
      setCurrentStep(2);
    }
  };

  // Handle metadata submission
  const handleMetadataSubmit = (metadata: ModelMetadata) => {
    setModelMetadata(metadata);
    setCurrentStep(4);
  };

  // Handle model details submission
  const handleDetailsSubmit = (
    name: string,
    description: string,
    tags: string[]
  ) => {
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
        variant: "destructive",
      });
      return;
    }

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your model.",
          variant: "destructive",
        });
        return;
      }

      // Determine category from metadata and tags
      const category = modelMetadata.industry.toLowerCase();
      const insights = ModelInsightsService.generateInsights(
        modelName,
        modelDescription
      );
      const allTags = [...insights.tags, ...customTags];

      // Create model record in database with all required fields
      const { data: modelData, error: modelError } = await supabase
        .from("models")
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
          status: "draft", // Initially not public to hirers
          category: category,
          difficulty_level: modelMetadata.complexity,
          view_count: 0,
          downloads: 0,
          quality_status: qualityStatus,
          quality_checked_at: new Date().toISOString(),
          quality_notes: qualityNotes,
        })
        .select()
        .single();

      if (modelError) {
        console.error("Error creating model:", modelError);
        toast({
          title: "Upload failed",
          description:
            modelError.message ||
            "An error occurred while saving your model. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Model created successfully:", modelData);

      // Save FormIQ analysis
      const { error: analysisError } = await supabase
        .from("formiq_analyses")
        .insert({
          model_id: modelData.id,
          printability_score: printabilityScore,
          material_recommendations: materialRecommendations,
          printing_techniques: printingTechniques,
          design_issues: designIssues,
          oem_compatibility: oemCompatibility,
        });

      if (analysisError) {
        console.error("Error saving analysis:", analysisError);
        // Don't fail the whole operation if analysis save fails
      }

      toast({
        title: "Model uploaded successfully!",
        description:
          "Your model has been uploaded and is now available in the marketplace.",
      });

      // Redirect to creator dashboard after successful upload
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error publishing model:", error);
      toast({
        title: "Upload failed",
        description:
          "An error occurred while publishing your model. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = () => {
    if (!loggedInUser) {
      setCreditPopUp(true);
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div>
        <img
          src={heroBackground}
          alt="heroBackground"
          className="h-full w-full object-cover rounded-b-[80px]"
        />

        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            backgroundImage: `
        radial-gradient(circle at 50% -300px, #002d6e, #002d6e, #000000, #000000, #000000, #000000)
      `,
            opacity: 0.8,
          }}
        ></div>
      </div>
      {loading ? (
        <div className="absolute inset-0 flex flex-col top-80 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 top-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-row gap-6">
              <div className="relative">
                {!showTextToCAD && !showImageToCAD && !showUploadToCAD && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-fit z-10">
                    <div className="flex flex-row items-center gap-1 bg-[#011532] w-fit rounded-[10px] p-1">
                      <motion.div
                        className={`rounded-[8px] px-6 py-2 cursor-pointer ${
                          CADConvertWay === "text"
                            ? "bg-[#001C43]"
                            : "bg-[#2E3947]/20"
                        }`}
                        onClick={() => {
                          setCADConvertWay("text");
                          setShowTextToCAD(false);
                          setShowImageToCAD(false);
                          setShowUploadToCAD(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Type size={20} />
                      </motion.div>
                      <motion.div
                        className={`rounded-[8px] px-6 py-2 cursor-pointer ${
                          CADConvertWay === "image"
                            ? "bg-[#001C43]"
                            : "bg-[#2E3947]/20"
                        }`}
                        onClick={() => {
                          setCADConvertWay("image");
                          setShowTextToCAD(false);
                          setShowImageToCAD(false);
                          setShowUploadToCAD(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image size={20} />
                      </motion.div>
                      <motion.div
                        className={`rounded-[8px] px-6 py-2 cursor-pointer ${
                          CADConvertWay === "upload"
                            ? "bg-[#001C43]"
                            : "bg-[#2E3947]/20"
                        }`}
                        onClick={() => {
                          setCADConvertWay("upload");
                          setShowTextToCAD(false);
                          setShowImageToCAD(false);
                          setShowUploadToCAD(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Upload size={20} />
                      </motion.div>
                      <motion.div
                        className={`rounded-[8px] px-6 py-2 cursor-pointer ${
                          CADConvertWay === "history"
                            ? "bg-[#001C43]"
                            : "bg-[#2E3947]/20"
                        }`}
                        onClick={() => {
                          setCADConvertWay("history");
                          setShowTextToCAD(false);
                          setShowImageToCAD(false);
                          setShowUploadToCAD(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <History size={20} />
                      </motion.div>
                    </div>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  {CADConvertWay === "text" && !showTextToCAD && (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <TextToCADFlow
                        handleGenerate={handleGenerate}
                        quality={quality}
                        setQuality={setQuality}
                      />
                    </motion.div>
                  )}
                  {CADConvertWay === "text" && showTextToCAD && (
                    <motion.div
                      key="textToImage"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <TextToCAD
                        setShowTextToCAD={setShowTextToCAD}
                        printAndDelivery={printAndDelivery}
                        setPrintAndDelivery={setPrintAndDelivery}
                        quality={quality}
                        setQuality={setQuality}
                      />
                    </motion.div>
                  )}
                  {CADConvertWay === "image" && !showImageToCAD && (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ImageToCADFlow
                        handleGenerate={handleGenerate}
                        quality={quality}
                        setQuality={setQuality}
                      />
                    </motion.div>
                  )}
                  {CADConvertWay === "image" && showImageToCAD && (
                    <motion.div
                      key="imageResult"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ImageToCAD setShowImageToCAD={setShowImageToCAD} />
                    </motion.div>
                  )}
                  {CADConvertWay === "upload" && !showUploadToCAD && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ModalToCADFlow handleGenerate={handleGenerate} />
                    </motion.div>
                  )}
                  {CADConvertWay === "upload" && showUploadToCAD && (
                    <motion.div
                      key="uploadResult"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <UploadToCAD setShowUploadToCAD={setShowUploadToCAD} />
                    </motion.div>
                  )}
                  {CADConvertWay === "history" && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <HistoryCADFlow />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/*} <div className="h-full bg-[#000813] rounded-[20px]">
                <div>Examples</div>
                <div></div>
                <img
                  src={elephantSmall}
                  alt="Standard"
                  className="w-full h-16 object-cover"
                />
                <img
                  src={elephant}
                  alt="Standard"
                  className="w-full h-28 object-cover"
                />
                <img
                  src={elephantSmall}
                  alt="Standard"
                  className="w-full h-16 object-cover"
                />
                <img
                  src={elephant}
                  alt="Standard"
                  className="w-full h-28 object-cover"
                />
              </div>*/}
            </div>
            {showTextToCAD || showImageToCAD || showUploadToCAD ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="text-[18px] font-medium">
                  Are you satisfied?
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-1 mt-8">
                <Radio size={16} />
                <span className="text-[14px] font-normal">
                  100 models generated today
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
      <CreditPopUp
        isOpen={creditPopUp}
        onClose={() => setCreditPopUp(false)}
        CADConvertWay={CADConvertWay}
        setShowTextToCAD={setShowTextToCAD}
        setShowImageToCAD={setShowImageToCAD}
        setShowUploadToCAD={setShowUploadToCAD}
        setCreditPopUp={setCreditPopUp}
        loading={loading}
        setLoading={setLoading}
      />
    </motion.div>
  );
};

export default UploadPromptToCAD;
