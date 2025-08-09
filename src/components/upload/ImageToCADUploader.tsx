import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileCheck, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@gradio/client";

interface ImageToCADUploaderProps {
  onModelGenerated: (file: File, filePath: string, fileInfo: any, sourceImage?: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

export const ImageToCADUploader = ({ 
  onModelGenerated, 
  uploading,
  setUploading 
}: ImageToCADUploaderProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { user, session } = useAuth();

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
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPG or PNG image.";
    }
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return "Image file is too large. Maximum size is 10MB.";
    }
    
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSelectedImage(file);
    setError("");
    setRetryCount(0);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generate3DModelFromImage = async (imageFile: File): Promise<string> => {
    console.log('Connecting to CADQUA API...');
    setConversionStatus("Connecting to CADQUA AI Generator...");
    
    try {
      const client = await Client.connect("https://formversedude--cadqua-3d-generator-gradio-app.modal.run");
      console.log('Connected to Gradio client successfully');
      
      setConversionProgress(30);
      setConversionStatus("Generating your 3D model...");
      
      const result = await client.predict("/generate_and_extract__glb", {
        image: imageFile,
        multiimages: [],
        is_multiimage: false,
        seed: 0,
        randomize_seed: true,
        ss_guidance_strength: 7.5,
        ss_sampling_steps: 12,
        slat_guidance_strength: 3.0,
        slat_sampling_steps: 12,
        multiimage_algo: "stochastic",
        mesh_simplify: 0.95,
        texture_size: 1024
      });

      console.log('CADQUA API response:', result);
      
      if (!result || !result.data || !result.data[2]) {
        throw new Error("Invalid response from CADQUA API - no 3D model generated");
      }
      
      const glbUrl = result.data[2];
      if (typeof glbUrl !== 'string' || !glbUrl) {
        throw new Error("Invalid GLB file URL received from API");
      }
      
      return glbUrl;
    } catch (error) {
      console.error('CADQUA API error:', error);
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error("Unable to connect to CADQUA AI service. Please check your internet connection and try again.");
        } else if (error.message.includes('timeout')) {
          throw new Error("Request timed out. Please try with a smaller image or retry later.");
        } else {
          throw new Error(`Generation failed: ${error.message}`);
        }
      }
      throw new Error("Unexpected error during model generation");
    }
  };

  const generateModelFromImage = async () => {
    if (!selectedImage || !user || !session) return;
    
    setUploading(true);
    setConversionProgress(0);
    setConversionStatus("Starting generation...");
    setError("");
    
    try {
      // Step 1: Upload image to Supabase storage
      const timestamp = Date.now();
      const imagePath = `${user.id}/images/${timestamp}-${selectedImage.name}`;
      
      console.log('Uploading image to storage...');
      setConversionProgress(10);
      setConversionStatus("Uploading image...");
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(imagePath, selectedImage);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      
      setConversionProgress(20);
      
      // Step 2: Generate 3D model using CADQUA API
      const glbUrl = await generate3DModelFromImage(selectedImage);
      
      setConversionProgress(70);
      setConversionStatus("Downloading generated model...");
      
      // Step 3: Download the generated GLB file
      console.log('Downloading GLB from:', glbUrl);
      const modelResponse = await fetch(glbUrl);
      if (!modelResponse.ok) {
        throw new Error(`Failed to download generated model: ${modelResponse.status} ${modelResponse.statusText}`);
      }
      
      const modelBlob = await modelResponse.blob();
      const modelFile = new File([modelBlob], `generated-${timestamp}.glb`, { type: 'model/gltf-binary' });
      
      setConversionProgress(85);
      setConversionStatus("Uploading generated model...");
      
      // Step 4: Upload the generated model to storage
      const modelPath = `${user.id}/${timestamp}-generated-model.glb`;
      
      const { data: modelUploadData, error: modelUploadError } = await supabase.storage
        .from('3d-models')
        .upload(modelPath, modelFile);

      if (modelUploadError) {
        throw new Error(`Failed to upload generated model: ${modelUploadError.message}`);
      }
      
      setConversionProgress(100);
      setConversionStatus("3D model ready! Loading preview...");
      
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
        setConversionStatus("");
        setSelectedImage(null);
        setImagePreview("");
        setRetryCount(0);
      }, 2000);
      
    } catch (error) {
      console.error('Image to CAD conversion error:', error);
      
      // Provide specific error messaging
      let errorMessage = "Model generation failed. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('upload failed')) {
          errorMessage = "Failed to upload image. Please check your connection and try again.";
        } else if (error.message.includes('Unable to connect')) {
          errorMessage = "CADQUA AI service is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Generation timed out. Please try with a smaller image.";
        } else if (error.message.includes('Invalid response')) {
          errorMessage = "Model generation failed. The API may be experiencing issues.";
        } else if (error.message.includes('Failed to download')) {
          errorMessage = "Generated model could not be downloaded. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setConversionProgress(0);
      setConversionStatus("");
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const retry = async () => {
    if (!selectedImage) return;
    
    if (retryCount >= 2) {
      setError("Maximum retry attempts reached. Please try with a different image or check your connection.");
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setError("");
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
        
        {selectedImage && imagePreview && !uploading && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm w-full">
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
              className="w-full"
              disabled={uploading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate 3D Model
            </Button>
          </div>
        )}
      </div>

      {/* Conversion Progress */}
      {(conversionProgress > 0 || uploading) && (
        <div className="mt-6 w-full max-w-xl">
          <div className="flex items-center mb-2">
            <div className="animate-pulse flex space-x-1 mr-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm font-medium">{conversionStatus || "Processing..."}</p>
          </div>
          <Progress value={conversionProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{conversionProgress}% complete</p>
        </div>
      )}

      {/* Error Display */}
      {error && !uploading && (
        <div className="mt-4 w-full max-w-xl">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-destructive mr-2" />
              <span className="font-medium text-destructive">Generation Failed</span>
            </div>
            <p className="text-sm text-destructive/80 mb-3">{error}</p>
            <div className="flex gap-2">
              <Button 
                onClick={retry}
                variant="destructive"
                size="sm"
                disabled={!selectedImage || retryCount >= 2}
              >
                Retry {retryCount > 0 && `(${retryCount}/2)`}
              </Button>
              {retryCount >= 2 && (
                <Button 
                  onClick={() => {
                    setError("");
                    setSelectedImage(null);
                    setImagePreview("");
                    setRetryCount(0);
                  }}
                  variant="outline"
                  size="sm"
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