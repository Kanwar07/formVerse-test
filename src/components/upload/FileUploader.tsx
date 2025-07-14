
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UploadIcon, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface FileUploaderProps {
  onFileSelected: (file: File, filePath: string, fileInfo: any) => void;
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
  const [fileInfo, setFileInfo] = useState<any>(null);
  const { toast } = useToast();
  const { user, session } = useAuth();

  const extractFileInfo = (file: File) => {
    const info = {
      name: file.name,
      size: file.size,
      type: file.type || `application/${file.name.split('.').pop()}`,
      lastModified: new Date(file.lastModified),
      extension: file.name.split('.').pop()?.toLowerCase(),
      sizeFormatted: formatFileSize(file.size)
    };
    setFileInfo(info);
    return info;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
    
    console.log('Current user for upload:', user.email, 'User ID:', user.id);
    
    // Extract file information
    const extractedInfo = extractFileInfo(file);
    console.log('File info extracted:', extractedInfo);
    
    // Validate file type
    const validTypes = ['.stl', '.obj', '.step', '.gltf', '.glb', '.iges', '.igs', '.stp'];
    const fileExt = `.${extractedInfo.extension}`;
    
    if (!validTypes.includes(fileExt)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CAD model file (STL, OBJ, GLTF, GLB, STEP, IGES).",
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
      // Create file path that matches RLS policy: {user_id}/{timestamp}-{filename}
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      console.log('Bucket: 3d-models');
      console.log('User ID:', user.id);
      console.log('File info:', extractedInfo);
      
      // Upload file to Supabase storage with correct path structure
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
            onFileSelected(file, data.path, extractedInfo);
            toast({
              title: "Upload successful!",
              description: `Your 3D model (${extractedInfo.sizeFormatted}) has been uploaded successfully.`,
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
          Supported formats: STL, OBJ, GLTF, GLB, STEP, IGES (Max 50MB)
        </p>
        <Input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          accept=".stl,.obj,.step,.gltf,.glb,.iges,.igs,.stp" 
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Label 
          htmlFor="file-upload" 
          className={`bg-primary text-primary-foreground py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? "Uploading..." : "Select File"}
        </Label>
        
        {modelFile && fileInfo && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm w-full">
            <div className="flex items-center mb-2">
              <FileCheck className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-medium">File Selected</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div><strong>Name:</strong> {fileInfo.name}</div>
              <div><strong>Size:</strong> {fileInfo.sizeFormatted}</div>
              <div><strong>Type:</strong> {fileInfo.extension?.toUpperCase()}</div>
            </div>
          </div>
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
