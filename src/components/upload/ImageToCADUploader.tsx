import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileCheck, Sparkles, AlertCircle, Search, Settings, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ImageToCADUploaderProps {
  onModelGenerated: (file: File, filePath: string, fileInfo: any, sourceImage?: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

type GenerationStage = 'idle' | 'uploading' | 'health-check' | 'warming-up' | 'generating' | 'downloading' | 'finalizing' | 'complete' | 'error' | 'retrying';

interface ErrorInfo {
  message: string;
  code?: string;
  retryAfter?: number;
}

export const ImageToCADUploader = ({ 
  onModelGenerated, 
  uploading,
  setUploading 
}: ImageToCADUploaderProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStage, setConversionStage] = useState<GenerationStage>('idle');
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const { toast } = useToast();
  const { user, session } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for retry button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryCountdown > 0) {
      timer = setTimeout(() => {
        setRetryCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const extractFileInfo = (file: File) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      extension: file.name.split('.').pop()?.toLowerCase(),
      sizeFormatted: formatFileSize(file.size)
    };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPG or PNG image.";
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return "Image file is too large. Maximum size is 10MB.";
    }
    
    return null;
  };

  const getStageInfo = (stage: GenerationStage) => {
    switch (stage) {
      case 'uploading':
        return {
          icon: UploadIcon,
          title: "Uploading image...",
          description: "Preparing your image for processing",
          progress: 10
        };
      case 'health-check':
        return {
          icon: Search,
          title: "Checking CADQUA service...",
          description: "Please wait while we warm up the AI service",
          progress: 25
        };
      case 'warming-up':
        return {
          icon: Settings,
          title: "Warming up AI model...",
          description: "Preparing the generation engine",
          progress: 40
        };
      case 'generating':
        return {
          icon: Sparkles,
          title: "Generating 3D Model...",
          description: "This can take up to 2 minutes",
          progress: 70
        };
      case 'downloading':
        return {
          icon: UploadIcon,
          title: "Downloading generated model...",
          description: "Retrieving your 3D model",
          progress: 85
        };
      case 'finalizing':
        return {
          icon: CheckCircle,
          title: "Finalizing upload...",
          description: "Almost ready!",
          progress: 95
        };
      case 'retrying':
        return {
          icon: Settings,
          title: "Retrying...",
          description: "Attempting generation again",
          progress: 30
        };
      case 'complete':
        return {
          icon: CheckCircle,
          title: "3D model ready!",
          description: "Loading preview...",
          progress: 100
        };
      default:
        return {
          icon: Sparkles,
          title: "Processing...",
          description: "Please wait",
          progress: 50
        };
    }
  };

  const getErrorMessage = (error: ErrorInfo) => {
    switch (error.code) {
      case 'SERVICE_UNAVAILABLE':
        return {
          title: "CADQUA AI service unavailable",
          message: "The AI service is starting up or experiencing issues. Please wait and try again.",
          type: "service-down" as const
        };
      case 'CONNECTION_TIMEOUT':
        return {
          title: "Connection timeout",
          message: "Unable to connect to the AI service. It may be starting up.",
          type: "service-down" as const
        };
      case 'GENERATION_TIMEOUT':
        return {
          title: "Generation took too long",
          message: "The AI generation process timed out. Try again with a smaller image.",
          type: "timeout" as const
        };
      case 'INVALID_RESPONSE':
        return {
          title: "Generation failed",
          message: "The AI service returned an invalid response. Please try again.",
          type: "service-error" as const
        };
      case 'NETWORK_ERROR':
        return {
          title: "Network error",
          message: "Please check your internet connection and try again.",
          type: "network" as const
        };
      default:
        return {
          title: "Generation failed",
          message: error.message || "An unexpected error occurred. Please try again.",
          type: "general" as const
        };
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validationError = validateImageFile(file);
    if (validationError) {
      setError({ message: validationError, code: 'VALIDATION_ERROR' });
      return;
    }
    
    setSelectedImage(file);
    setError(null);
    setRetryCount(0);
    setConversionStage('idle');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generate3DModelFromImage = async (imageFile: File): Promise<string> => {
    console.log('Starting 3D model generation...');
    
    try {
      // Create FormData for the edge function
      const formData = new FormData();
      formData.append('input_image', imageFile);
      
      setConversionStage('health-check');
      
      // Call the edge function with detailed logging
      console.log('Calling modal-image-to-cad edge function...', {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type
      });
      
      const { data, error } = await supabase.functions.invoke('modal-image-to-cad', {
        body: formData
      });

      if (error) {
        console.error('Edge function error details:', {
          message: error.message,
          details: error.details,
          code: error.code,
          context: error.context
        });
        
        // Handle specific error codes
        if (error.code === 'SERVICE_UNAVAILABLE') {
          throw new Error(`CADQUA AI service is unavailable. ${error.details || 'Please try again in a few minutes.'}`);
        } else if (error.code === 'CONNECTION_TIMEOUT') {
          throw new Error(`Connection timeout. The service may be starting up. Please try again in 30 seconds.`);
        } else if (error.code === 'GENERATION_TIMEOUT') {
          throw new Error(`Generation timed out. Try with a smaller image or simpler content.`);
        } else {
          throw new Error(error.details || error.message || 'Failed to generate 3D model');
        }
      }

      console.log('Edge function response:', data);
      
      // Handle new response format: { video, glb, download }
      let glbUrl;
      if (data && (data.glb || data.download)) {
        glbUrl = data.glb || data.download;
      }
      // Fallback to old format if new format not available
      else if (data && data.data && data.data[2]) {
        glbUrl = data.data[2];
      }
      else {
        console.error('Invalid response structure:', data);
        throw new Error("Invalid response from CADQUA AI - no 3D model generated. Please try again.");
      }
      
      if (typeof glbUrl !== 'string' || !glbUrl) {
        console.error('Invalid GLB URL:', glbUrl);
        throw new Error("Invalid 3D model file received from AI service. Please try again.");
      }
      
      console.log('3D model generation successful:', glbUrl);
      return glbUrl;
    } catch (error) {
      console.error('Generation error:', error);
      
      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error during 3D model generation. Please try again.');
      }
    }
  };

  const generateModelFromImage = async () => {
    if (!selectedImage || !user || !session) return;
    
    setUploading(true);
    setConversionProgress(0);
    setConversionStage('uploading');
    setError(null);
    
    const maxRetries = 2;
    let currentAttempt = 0;
    
    const attemptGeneration = async (): Promise<void> => {
      currentAttempt++;
      
      try {
        // Step 1: Upload image to Supabase storage
        const timestamp = Date.now();
        const imagePath = `${user.id}/images/${timestamp}-${selectedImage.name}`;
        
        console.log('Uploading image to storage...');
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('3d-models')
          .upload(imagePath, selectedImage);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
        
        setConversionProgress(20);
        setConversionStage('generating');

        // Step 2: Generate 3D model
        const glbUrl = await generate3DModelFromImage(selectedImage);
        
        setConversionProgress(70);
        setConversionStage('downloading');
        
        // Step 3: Download the generated GLB file
        console.log('Downloading GLB from:', glbUrl);
        const modelResponse = await fetch(glbUrl);
        if (!modelResponse.ok) {
          throw new Error(`Failed to download generated model: ${modelResponse.status} ${modelResponse.statusText}`);
        }
        
        const modelBlob = await modelResponse.blob();
        const modelFile = new File([modelBlob], `generated-${timestamp}.glb`, { type: 'model/gltf-binary' });
        
        setConversionProgress(85);
        setConversionStage('finalizing');
        
        // Step 4: Upload the generated model to storage
        const modelPath = `${user.id}/${timestamp}-generated-model.glb`;
        
        const { data: modelUploadData, error: modelUploadError } = await supabase.storage
          .from('3d-models')
          .upload(modelPath, modelFile);

        if (modelUploadError) {
          throw new Error(`Failed to upload generated model: ${modelUploadError.message}`);
        }
        
        setConversionProgress(100);
        setConversionStage('complete');
        
        // Step 5: Pass to the main upload flow
        const fileInfo = extractFileInfo(modelFile);
        onModelGenerated(modelFile, modelUploadData.path, fileInfo, imagePath);
        
        toast({
          title: "Success!",
          description: "Your 3D model has been generated successfully from the image.",
        });
        
        // Reset state after success
        setTimeout(() => {
          setConversionProgress(0);
          setConversionStage('idle');
          setSelectedImage(null);
          setImagePreview("");
          setRetryCount(0);
        }, 2000);

      } catch (error) {
        console.error(`Generation attempt ${currentAttempt} failed:`, error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Check if we should retry
        const shouldRetry = currentAttempt < maxRetries && 
          (errorMessage.includes('timeout') || 
           errorMessage.includes('unavailable') || 
           errorMessage.includes('network') ||
           errorMessage.includes('starting up'));
        
        if (shouldRetry) {
          const retryDelay = Math.pow(2, currentAttempt - 1) * 2000; // 2s, 4s exponential backoff
          
          toast({
            title: `Attempt ${currentAttempt} failed`,
            description: `Retrying in ${retryDelay / 1000} seconds... (${currentAttempt}/${maxRetries})`,
            variant: "default"
          });
          
          setConversionStage('retrying');
          
          setTimeout(() => {
            attemptGeneration();
          }, retryDelay);
          
        } else {
          // Final failure - parse error response to extract structured error info
          let errorInfo: ErrorInfo;
          
          try {
            if (errorMessage) {
              const errorData = JSON.parse(errorMessage);
              errorInfo = {
                message: errorData.error || errorData.details || errorMessage,
                code: errorData.code,
                retryAfter: errorData.retryAfter
              };
            } else {
              errorInfo = { message: errorMessage || "Model generation failed" };
            }
          } catch {
            errorInfo = { message: errorMessage || "Model generation failed" };
          }
          
          setError(errorInfo);
          setConversionProgress(0);
          setConversionStage('error');
          
          // Set countdown if retryAfter is provided
          if (errorInfo.retryAfter) {
            setRetryCountdown(errorInfo.retryAfter);
          }
          
          const errorDisplay = getErrorMessage(errorInfo);
          toast({
            title: errorDisplay.title,
            description: errorDisplay.message,
            variant: "destructive"
          });
        }
      }
    };
    
    // Start the generation process
    await attemptGeneration();
    
    setUploading(false);
  };

  const retry = async () => {
    if (!selectedImage || retryCountdown > 0) return;
    
    if (retryCount >= 2) {
      setError({ 
        message: "Maximum retry attempts reached. Please try with a different image or check your connection.",
        code: 'MAX_RETRIES'
      });
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setError(null);
    setRetryCountdown(0);
    await generateModelFromImage();
  };

  // Show authentication warning if user is not signed in
  if (!user || !session) {
    return (
      <div className="flex flex-col items-center">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 w-full max-w-xl flex flex-col items-center justify-center text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Sign in required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please sign in to generate 3D models from images
          </p>
          <a 
            href="/signin" 
            className="bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const stageInfo = getStageInfo(conversionStage);
  const StageIcon = stageInfo.icon;

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 w-full max-w-xl flex flex-col items-center justify-center text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Upload an image to generate a 3D model</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Supported formats: JPG, PNG (Max 10MB)
        </p>
        <p className="text-xs text-muted-foreground/70 mb-4 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by CADQUA AI Generator
        </p>
        
        <Input 
          type="file" 
          className="hidden" 
          id="image-upload" 
          accept="image/jpeg,image/png,image/jpg" 
          onChange={handleImageChange}
          disabled={uploading}
        />
        <Label 
          htmlFor="image-upload" 
          className={`bg-primary text-primary-foreground py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? "Processing..." : "Select Image"}
        </Label>
        
        {selectedImage && imagePreview && !uploading && conversionStage === 'idle' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm w-full animate-fade-in">
            <div className="flex items-center mb-2">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-medium">Image Selected</span>
            </div>
            <div className="mb-3">
              <img 
                src={imagePreview} 
                alt="Selected image" 
                className="w-full h-32 object-cover rounded border"
              />
            </div>
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div><strong>Name:</strong> {selectedImage.name}</div>
              <div><strong>Size:</strong> {formatFileSize(selectedImage.size)}</div>
              <div><strong>Type:</strong> {selectedImage.type}</div>
            </div>
            <Button 
              onClick={generateModelFromImage}
              className="w-full hover-scale"
              disabled={uploading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate 3D Model
            </Button>
          </div>
        )}
      </div>

      {/* Conversion Progress */}
      {(conversionProgress > 0 || uploading) && conversionStage !== 'idle' && (
        <div className="mt-6 w-full max-w-xl animate-fade-in">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="mr-3">
                <StageIcon className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{stageInfo.title}</p>
                <p className="text-xs text-muted-foreground">{stageInfo.description}</p>
              </div>
            </div>
            <Progress value={conversionProgress} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground text-right">{conversionProgress}% complete</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && conversionStage === 'error' && (
        <div className="mt-4 w-full max-w-xl animate-fade-in">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-destructive mr-2" />
              <span className="font-medium text-destructive">{getErrorMessage(error).title}</span>
            </div>
            <p className="text-sm text-destructive/80 mb-3">{getErrorMessage(error).message}</p>
            <div className="flex gap-2">
              <Button 
                onClick={retry}
                variant="destructive"
                size="sm"
                disabled={!selectedImage || retryCount >= 2 || retryCountdown > 0}
                className="hover-scale"
              >
                {retryCountdown > 0 ? `Retry in ${retryCountdown}s` : 
                 retryCount > 0 ? `Retry (${retryCount}/2)` : 'Retry'}
              </Button>
              {retryCount >= 2 && (
                <Button 
                  onClick={() => {
                    setError(null);
                    setSelectedImage(null);
                    setImagePreview("");
                    setRetryCount(0);
                    setConversionStage('idle');
                  }}
                  variant="outline"
                  size="sm"
                  className="hover-scale"
                >
                  Start Over
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};