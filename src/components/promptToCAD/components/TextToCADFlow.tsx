import TextArea from "@/components/common/TextArea";
import { Info, Lightbulb } from "lucide-react";
import elephant from "@/assets/PromptToCAD/elephant.webp";
import elephantSmall from "@/assets/PromptToCAD/elephantSmall.webp";
import { useState } from "react";
import Button from "@/components/common/Button";

export default function TextToCADFlow({ handleGenerate, quality, setQuality }) {
  return (
    <div className="p-8 w-full sm:w-[400px] md:w-[530px] md:h-[568px] bg-[#001F4C]/50 rounded-[20px] flex flex-col gap-6">
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-row justify-between">
          <div className="text-[14px] font-bold">Prompt</div>
          <div className="flex flex-row gap-2">
            <Lightbulb size={16} className="cursor-pointer" />
            <Info size={16} className="cursor-pointer" />
          </div>
        </div>
        <TextArea
          placeholder="Eg. Elephant in the room of a huge skyscraper of NYC, wearing jeans"
          rows={2}
        />
      </div>

      <div className="flex gap-4 mb-4">
        {/* Standard */}
        <div
          className={`flex-1 flex flex-col cursor-pointer rounded-[8px] overflow-hidden transition-all duration-200 ease-in-out select-none ${
            quality === "standard"
              ? "border-2 border-[#0A8DD1] bg-[#001C43]"
              : "border-2 border-transparent bg-[#001C43]"
          }`}
          onClick={() => {
            setQuality("standard");
          }}
        >
          <div className="flex-grow bg-[#001C43] flex flex-row">
            <img
              src={elephantSmall}
              alt="Standard"
              className="w-full h-16 object-cover"
              draggable="false"
            />
            <img
              src={elephant}
              alt="Standard"
              className="w-full h-28 object-cover"
              draggable="false"
            />
          </div>

          <div className="p-3 bg-[#0E284F]">
            <h3 className="text-[14px] font-bold">Standard</h3>
            <p className="text-[12px] text-[#ffffff]/80 font-normal">
              Preview your model in a video before confirming
            </p>
          </div>
        </div>

        {/* High Quality */}
        <div
          className={`flex-1 flex flex-col cursor-pointer rounded-[8px] overflow-hidden relative transition-all duration-200 ease-in-out select-none ${
            quality === "high"
              ? "border-2 border-[#0A8DD1] bg-[#001C43]"
              : "border-2 border-transparent bg-[#001C43]"
          }`}
          onClick={() => {
            setQuality("high");
          }}
        >
          <span className="absolute top-2 left-0 text-[10px] font-normal bg-[#0E284F] text-[#ffffff]/60 px-2 py-0.5 z-10">
            Recommended
          </span>
          <div className="flex-grow flex items-center justify-center">
            <img
              src={elephant}
              alt="High Quality"
              className="w-full h-24 object-cover"
              draggable="false"
            />
          </div>
          <div className="p-3 bg-[#0E284F]">
            <h3 className="text-[14px] font-bold">High Quality</h3>
            <p className="text-[12px] text-[#ffffff]/80 font-normal">
              Directly generate a high quality 3D model
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[14px] font-bold mb-1">Caption your model</div>
        <TextArea placeholder="Eg. Elephant in the room" rows={1} />
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-2">
        {quality === "standard" ? (
          <div className="flex flex-row items-center gap-1 text-[12px] opacity-60">
            <div className="h-3 w-[2px] bg-[#AAAAAA]/20" /> <span>1 min</span>
            <div className="h-3 w-[2px] bg-[#AAAAAA]/20" /> <span>Free</span>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-1 text-[12px] opacity-60">
            <div className="h-3 w-[2px] bg-[#AAAAAA]/20" /> <span>5 min</span>
            <div className="h-3 w-[2px] bg-[#AAAAAA]/20" />{" "}
            <span>5 credits</span>
          </div>
        )}
        <div className="w-full flex justify-center">
          <Button
            disabled={quality === ""}
            className={quality === "" ? "bg-[#485E7E]" : ""}
            onClick={() => handleGenerate()}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
