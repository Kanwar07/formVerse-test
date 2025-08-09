import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileCheck, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (JPG, PNG)");
      return;
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError("Image file is too large. Maximum size is 10MB.");
      return;
    }
    
    setSelectedImage(file);
    setError("");
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateModelFromImage = async () => {
    if (!selectedImage || !user || !session) return;
    
    setUploading(true);
    setConversionProgress(0);
    setConversionStatus("Uploading image...");
    setError("");
    
    try {
      // Step 1: Upload image to Supabase storage
      const timestamp = Date.now();
      const imagePath = `${user.id}/images/${timestamp}-${selectedImage.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(imagePath, selectedImage);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      
      setConversionProgress(20);
      setConversionStatus("Generating 3D model with CADQUA AI...");
      
      // Step 2: Call the Modal API via edge function
      const formData = new FormData();
      formData.append('input_image', selectedImage);
      
      const response = await fetch(`https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/modal-image-to-cad`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbnp4cGJ0aGxkZnFxYnp6amN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MzIxNzgsImV4cCI6MjA2NDUwODE3OH0.7YWUyL31eeOtauM4TqHjQXm8PB1Y-wVB7Cj0dSMQ0SA'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Model generation failed: ${errorData.error || 'API request failed'}`);
      }

      const conversionData = await response.json();
      
      setConversionProgress(70);
      setConversionStatus("Processing generated model...");
      
      // Step 3: Handle the conversion result
      if (!conversionData || !conversionData.data || !conversionData.data[2]) {
        throw new Error("Invalid response from model generation API");
      }
      
      const generatedModelUrl = conversionData.data[2]; // .glb file URL from Modal API
      
      setConversionProgress(85);
      setConversionStatus("Downloading generated model...");
      
      // Step 4: Download the generated model
      const modelResponse = await fetch(generatedModelUrl);
      if (!modelResponse.ok) {
        throw new Error("Failed to download generated model");
      }
      
      const modelBlob = await modelResponse.blob();
      const modelFile = new File([modelBlob], `generated-${timestamp}.glb`, { type: 'model/gltf-binary' });
      
      setConversionProgress(95);
      setConversionStatus("Uploading generated model...");
      
      // Step 5: Upload the generated model to storage
      const modelPath = `${user.id}/${timestamp}-generated-model.glb`;
      
      const { data: modelUploadData, error: modelUploadError } = await supabase.storage
        .from('3d-models')
        .upload(modelPath, modelFile);

      if (modelUploadError) {
        throw new Error(`Failed to upload generated model: ${modelUploadError.message}`);
      }
      
      setConversionProgress(100);
      setConversionStatus("3D model ready! Loading preview...");
      
      // Step 6: Pass to the main upload flow
      const fileInfo = extractFileInfo(modelFile);
      onModelGenerated(modelFile, modelUploadData.path, fileInfo, imagePath);
      
      toast({
        title: "3D Model Generated!",
        description: "Your image has been successfully converted to a 3D model.",
      });
      
      // Reset state
      setTimeout(() => {
        setConversionProgress(0);
        setConversionStatus("");
        setSelectedImage(null);
        setImagePreview("");
      }, 2000);
      
    } catch (error) {
      console.error('Image to CAD conversion error:', error);
      
      // Provide more specific error messaging based on error type
      let errorMessage = "Model generation failed. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid file type')) {
          errorMessage = "Invalid file type. Please upload a JPG or PNG image.";
        } else if (error.message.includes('too large')) {
          errorMessage = "Image file is too large. Maximum size is 10MB.";
        } else if (error.message.includes('API service may be temporarily unavailable')) {
          errorMessage = "The AI generation service is temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes('timed out')) {
          errorMessage = "Generation timed out. Please try with a smaller image.";
        } else if (error.message.includes('Edge Function returned a non-2xx status code')) {
          errorMessage = "Model generation service error. Please check your image format and try again.";
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

  const retry = () => {
    setError("");
    if (selectedImage) {
      generateModelFromImage();
    }
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
        
        {selectedImage && imagePreview && (
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
            {!uploading && !error && (
              <Button 
                onClick={generateModelFromImage}
                className="w-full"
                disabled={uploading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate 3D Model
              </Button>
            )}
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
      {error && (
        <div className="mt-4 w-full max-w-xl">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-destructive mr-2" />
              <span className="font-medium text-destructive">Generation Failed</span>
            </div>
            <p className="text-sm text-destructive/80 mb-3">{error}</p>
            <Button 
              onClick={retry}
              variant="destructive"
              size="sm"
              disabled={!selectedImage}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};