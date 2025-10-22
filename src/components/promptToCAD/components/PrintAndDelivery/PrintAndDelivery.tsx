import SecondaryButton from "@/components/common/SecondaryButton";
import image from "../../../../assets/PromptToCAD/image.png";
import { Modal } from "antd";
import { Printer, X } from "lucide-react";
import Button from "@/components/common/Button";
import { useModelProgressStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface PrintAndDeliveryProps {
  isOpen: boolean;
  onClose: () => void;
  quality: string;
  setQuality: (value: string) => void;
}

export default function PrintAndDelivery({
  isOpen,
  onClose,
  quality,
  setQuality,
}: PrintAndDeliveryProps) {
  const navigate = useNavigate();
  const [isConverting, setIsConverting] = useState(false);

  const { setProcessing } = useModelProgressStore();

  const handleConvertToHighQuality = () => {
    setIsConverting(true);

    setTimeout(() => {
      setQuality("high");
      setIsConverting(false);
    }, 800);
  };

  const handlePrint = () => {
    setProcessing(true);
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Custom dark background overlay (non-blocking) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 pointer-events-none z-[999]" />
      )}

      {/* Main Centered Modal */}
      <Modal
        open={isOpen}
        footer={null}
        closable={false}
        centered
        width={600}
        zIndex={1000}
        mask={false}
        styles={{
          wrapper: {
            pointerEvents: "none",
          },
          content: {
            backgroundColor: "#02132C",
            padding: 0,
            borderRadius: "20px",
            pointerEvents: "auto",
          },
        }}
      >
        <div className="text-white">
          <div className="grid grid-cols-3 items-center px-4 py-4">
            <h2 className="text-center text-[14px] font-bold col-start-2">
              Printing and Delivery
            </h2>
            <X
              onClick={() => onClose()}
              className="justify-self-end cursor-pointer text-white"
              size={20}
            />
          </div>

          <div className="w-full">
            <img
              src={image}
              alt="Print preview"
              className="w-full h-[200px] object-cover"
            />
          </div>

          <div className="mt-6 pb-4 flex flex-col gap-4 items-center">
            <span className="text-[14px] font-bold opacity-60">
              Our team will contact you.
            </span>
            <span className="text-[12px] font-normal bg-[#D9D9D9]/10 rounded-[8px] px-10 py-4">
              Hey, I want this model to be printed.
            </span>
            <SecondaryButton
              className="w-[200px]"
              onClick={() => console.log("Send button clicked")}
            >
              Send
            </SecondaryButton>
          </div>
        </div>
      </Modal>

      <Modal
        open={isOpen}
        footer={null}
        closable={false}
        width={250}
        zIndex={1002}
        mask={false}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          margin: 0,
        }}
        styles={{
          wrapper: {
            pointerEvents: "none",
          },
          content: {
            backgroundColor: "transparent",
            borderRadius: "12px",
            padding: "16px",
            color: "white",
            pointerEvents: "auto",
          },
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="text-[12px] font-normal flex flex-row items-center gap-2 justify-center">
            <span>1 min</span>
            <hr className="h-[15px] w-[2px] bg-[#AAAAAA]/20" />
            <span>5 credits</span>
          </div>
          {quality === "standard" && (
            <SecondaryButton
              className={`cursor-pointer transition-all duration-300 ${
                isConverting
                  ? "scale-95 opacity-70 animate-pulse"
                  : "hover:scale-105 active:scale-95"
              }`}
              onClick={handleConvertToHighQuality}
              disabled={isConverting}
            >
              {isConverting ? "Converting..." : "Convert to High Quality"}
            </SecondaryButton>
          )}
          <Button className="cursor-pointer" onClick={() => handlePrint()}>
            <div className="flex flex-row gap-2 items-center justify-center">
              <Printer size={16} /> <span>Print</span>
            </div>
          </Button>
        </div>
      </Modal>
    </>
  );
}
