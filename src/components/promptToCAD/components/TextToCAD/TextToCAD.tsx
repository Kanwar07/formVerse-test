import elephantVideo from "@/assets/PromptToCAD/elephantVideo.png";
import SecondaryButton from "@/components/common/SecondaryButton";
import {
  ChevronLeft,
  EyeOff,
  Grid3x3,
  History,
  Info,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import PrintAndDelivery from "../PrintAndDelivery/PrintAndDelivery";

interface TextToCADProps {
  setShowTextToCAD: (show: boolean) => void;
  printAndDelivery: boolean;
  setPrintAndDelivery: (show: boolean) => void;
  quality?: string;
  setQuality?: (quality: string) => void;
}

export default function TextToCAD({
  setShowTextToCAD,
  printAndDelivery,
  setPrintAndDelivery,
  quality,
  setQuality,
}: TextToCADProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-1 items-center justify-center">
        <img
          src={elephantVideo}
          alt="Generated image"
          className="max-w-full h-auto object-contain scale-125"
        />
      </div>
      <div className="flex flex-row items-start gap-6">
        <div className="mt-16 flex flex-col items-end gap-4">
          <div className="flex flex-row gap-2 items-center bg-[#1f222b] px-2 py-1 rounded-[6px] cursor-pointer hover:bg-[#2a2d38] transition-colors duration-200">
            <Info size={16} />
            <span className="text-[12px] font-bold ">Model View</span>
          </div>
          <div className="flex flex-col gap-6 bg-[#16161d] px-2 py-3 rounded-[6px]">
            <EyeOff
              size={18}
              className="cursor-pointer hover:text-[#0A8DD1] transition-colors duration-200"
            />
            <Grid3x3
              size={18}
              className="cursor-pointer hover:text-[#0A8DD1] transition-colors duration-200"
            />
            <RotateCcw
              size={18}
              className="cursor-pointer hover:text-[#0A8DD1] transition-colors duration-200"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-center w-full">
              <div className="cursor-pointer border border-[#0A8DD1] rounded-[8px] bg-[#00000066] py-2 text-center whitespace-nowrap w-[240px]">
                Saved in your dashboard
              </div>
            </div>
          </div>

          <div className="bg-[#001F4C]/50 rounded-[20px] w-[280px] flex-shrink-0 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between py-4 px-4">
              <span
                className="text-[14px] font-bold flex flex-row gap-1 cursor-pointer hover:text-[#0A8DD1] transition-colors duration-200"
                onClick={() => setShowTextToCAD(false)}
              >
                <ChevronLeft /> <span>Text to image</span>
              </span>
              <History
                size={16}
                className="cursor-pointer hover:text-[#0A8DD1] transition-colors duration-200"
              />
            </div>

            <div>
              <div className="bg-[#00575D]/50 rounded-b-[20px] flex flex-col gap-2 px-6 pb-4 pt-2">
                <span className="text-[12px] opacity-50">Standard</span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold">
                    Elephant in the room
                  </span>
                  <span className="text-[12px] font-normal">
                    Elephant in the room of a huge skyscrapper of NYC, wearing
                    jeans
                  </span>
                </div>
              </div>
              <div
                className="flex flex-col gap-4 px-4 mt-4 h-[350px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#3A3A3A_transparent] 
  [&::-webkit-scrollbar]:w-2 
  [&::-webkit-scrollbar-track]:bg-white/50 
  [&::-webkit-scrollbar-thumb]:bg-[#ffffff1A] 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  hover:[&::-webkit-scrollbar-thumb]:bg-[#ffffff1A]"
              >
                <div
                  onClick={() => setSelectedImage(0)}
                  className={`rounded-[15px] cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedImage === 0
                      ? "border-2 border-[#0A8DD1]"
                      : "border-2 border-transparent hover:border-[#0A8DD1]/50"
                  }`}
                >
                  <img
                    src={elephantVideo}
                    alt="Option 1"
                    className="w-full h-[140px] object-cover rounded-[13px]"
                  />
                </div>
                <div
                  onClick={() => setSelectedImage(1)}
                  className={`rounded-[15px] cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedImage === 1
                      ? "border-2 border-[#0A8DD1]"
                      : "border-2 border-transparent hover:border-[#0A8DD1]/50"
                  }`}
                >
                  <img
                    src={elephantVideo}
                    alt="Option 2"
                    className="w-full h-[140px] object-cover rounded-[13px]"
                  />
                </div>
                <div
                  onClick={() => setSelectedImage(2)}
                  className={`rounded-[15px] cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedImage === 2
                      ? "border-2 border-[#0A8DD1]"
                      : "border-2 border-transparent hover:border-[#0A8DD1]/50"
                  }`}
                >
                  <img
                    src={elephantVideo}
                    alt="Option 2"
                    className="w-full h-[140px] object-cover rounded-[13px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center p-4">
              <SecondaryButton
                className="w-full"
                onClick={() => setPrintAndDelivery(true)}
              >
                Print this model
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
      <PrintAndDelivery
        isOpen={printAndDelivery}
        onClose={() => setPrintAndDelivery(false)}
        quality={quality}
        setQuality={setQuality}
      />
    </div>
  );
}
