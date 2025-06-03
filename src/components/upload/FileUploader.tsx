
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { uploadModel } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return newProgress;
        });
      }, 200);
      
      // Get current user
      const { user, error: userError } = await getCurrentUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication error",
          description: "Please log in to upload models.",
          variant: "destructive"
        });
        setUploading(false);
        clearInterval(progressInterval);
        return;
      }
      
      // Upload file to Supabase storage
      const { path, error } = await uploadModel(file, user.id);
      
      clearInterval(progressInterval);
      
      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        });
        setUploadProgress(0);
        setUploading(false);
        return;
      }
      
      setUploadProgress(100);
      
      setTimeout(() => {
        if (path) {
          onFileSelected(file, path);
        }
      }, 500);
    } catch (error) {
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
