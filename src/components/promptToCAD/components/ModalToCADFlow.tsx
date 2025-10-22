import TextArea from "@/components/common/TextArea";
import { Info, Lightbulb, Upload, X, FileIcon } from "lucide-react";
import { useState, useRef } from "react";
import Button from "@/components/common/Button";
import { useToast } from "@/hooks/use-toast";

const ACCEPTED_FILE_TYPES = [
  ".stl",
  ".obj",
  ".gltf",
  ".glb",
  ".step",
  ".iges",
  ".stp",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

export default function ModalToCADFlow({ handleGenerate }) {
  const [modal, setModal] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!ACCEPTED_FILE_TYPES.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid 3D model file (${ACCEPTED_FILE_TYPES.join(
          ", "
        )})`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `File size must be less than 50 MB. Your file is ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && validateFile(file)) {
      setModal(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }

    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setModal(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateClick = () => {
    if (modal && caption.trim()) {
      handleGenerate(modal, caption);
    }
  };

  return (
    <div className="p-8 w-full sm:w-[400px] md:w-[530px] md:h-[568px] bg-[#001F4C]/50 rounded-[20px] flex flex-col gap-6">
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-row justify-between">
          <div className="text-[14px] font-bold">Upload</div>
          <div className="flex flex-row gap-2">
            <Lightbulb size={16} className="cursor-pointer" />
            <Info size={16} className="cursor-pointer" />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={handleFileClick}
          className="flex flex-col items-center gap-3 justify-center bg-[#D9D9D9]/10 rounded-[8px] px-6 py-24 cursor-pointer hover:bg-[#D9D9D9]/20 transition-colors"
        >
          {modal ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <FileIcon size={60} className="opacity-60" />
              <div className="flex flex-col items-center mt-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold truncate max-w-[300px]">
                    {modal.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="hover:bg-red-500/20 rounded-full p-1 transition-colors"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
                <span className="text-[12px] font-normal text-[#FFFFFF]/60">
                  {(modal.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          ) : (
            <>
              <Upload size={60} className="opacity-60" />
              <div className="flex flex-col items-center mt-2">
                <span className="text-[14px] font-bold">
                  Upload your 3D model
                </span>
                <span className="text-[12px] font-normal text-[#FFFFFF]/60">
                  STL, OBJ, GLTF, GLB, STEP, IGES | Max size: 50 MB
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[14px] font-bold mb-2">Caption your model</div>
        <TextArea
          placeholder="Eg. Elephant in the room"
          rows={1}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-center">
        <Button
          disabled={!modal || caption.trim() === ""}
          className={!modal || caption.trim() === "" ? "bg-[#485E7E]" : ""}
          onClick={handleGenerateClick}
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
