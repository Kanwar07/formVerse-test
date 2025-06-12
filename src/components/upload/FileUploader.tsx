
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface FileUploaderProps {
  onFileSelected: (file: File, filePath: string) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
}

export const FileUploader = ({ 
  onFileSelected, 
  uploadProgress, 
  setUploadProgress 
}: FileUploaderProps) => {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check authentication first
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload models.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Current user for upload:', user.email);
    
    // Validate file type
    const validTypes = ['.stl', '.obj', '.step'];
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!validTypes.includes(fileExt)) {
      toast({
        title: "Invalid file format",
        description: "Please upload an STL, OBJ, or STEP file.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB.",
        variant: "destructive"
      });
      return;
    }
    
    setModelFile(file);
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Create unique file path
      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}-${file.name}`;
      const filePath = `models/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('3d-models')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: error.message || "An error occurred during upload.",
          variant: "destructive"
        });
        setUploadProgress(0);
        return;
      }

      console.log('Upload successful:', data);

      // Simulate progress for better UX (Supabase doesn't provide upload progress)
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(() => {
            onFileSelected(file, data.path);
            toast({
              title: "Upload successful!",
              description: "Your 3D model has been uploaded successfully.",
            });
          }, 500);
          return;
        }
        setUploadProgress(currentProgress);
      }, 100);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Show authentication warning if user is not signed in
  if (!user || !session) {
    return (
      <div className="flex flex-col items-center">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 w-full max-w-xl flex flex-col items-center justify-center text-center">
          <UploadIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Sign in required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please sign in to upload your 3D models
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
          disabled={uploading}
        />
        <Label 
          htmlFor="file-upload" 
          className={`bg-primary text-primary-foreground py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? "Uploading..." : "Select File"}
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
    </div>
  );
};
