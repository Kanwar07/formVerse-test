
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  uploadProgress: number;
}

export const FileUploader = ({ onFileSelected, uploadProgress }: FileUploaderProps) => {
  const [modelFile, setModelFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      onFileSelected(file);
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
        />
        <Label 
          htmlFor="file-upload" 
          className="bg-primary text-primary-foreground py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Select File
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
