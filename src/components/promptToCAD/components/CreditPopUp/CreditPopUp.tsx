import SecondaryButton from "@/components/common/SecondaryButton";
import { Modal } from "antd";
import { X } from "lucide-react";
import { useState } from "react";
import Loading from "../Loading";

interface CreditPopUpProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  CADConvertWay: string;
  setShowTextToCAD: (value: boolean) => void;
  setShowImageToCAD: (value: boolean) => void;
  setShowUploadToCAD: (value: boolean) => void;
  setCreditPopUp: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export default function CreditPopUp({
  isOpen,
  onClose,
  CADConvertWay,
  setShowTextToCAD,
  setShowImageToCAD,
  setShowUploadToCAD,
  setCreditPopUp,
  loading,
  setLoading,
}: CreditPopUpProps) {
  const Proceed = () => {
    if (CADConvertWay === "text") {
      setCreditPopUp(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowTextToCAD(true);
      }, 5000);
    } else if (CADConvertWay === "image") {
      setCreditPopUp(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowImageToCAD(true);
      }, 5000);
    } else if (CADConvertWay === "upload") {
      setCreditPopUp(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowUploadToCAD(true);
      }, 5000);
    }
  };

  const [selectedCreditsOption, setSelectedCreditsOption] = useState<
    number | null
  >(null);

  const creditData = [
    {
      id: 1,
      credits: "60",
      creditsPer: "3.20",
      price: "40",
      discount: "20",
      popular: false,
    },
    {
      id: 2,
      credits: "900",
      creditsPer: "2.80",
      price: "450",
      discount: "25",
      popular: true,
    },
    {
      id: 3,
      credits: "1000",
      creditsPer: "2.50",
      price: "500",
      discount: "30",
      popular: false,
    },
  ];

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        closable={false}
        centered
        width={800}
        zIndex={1001}
        styles={{
          content: {
            backgroundColor: "#02132C",
            padding: 0,
            borderRadius: "20px",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <div className="relative px-12 py-10 text-white">
          <div
            className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle 400px at center, #8853FA66 0%, transparent 75%)",
              filter: "blur(20px)",
            }}
          ></div>

          <div className="relative z-10 grid grid-cols-3 items-center mb-10">
            <h2 className="text-[16px] font-medium col-start-2 whitespace-nowrap text-center">
              Get extra credits without subscription
            </h2>
            <X
              onClick={() => onClose()}
              className="justify-self-end cursor-pointer text-white"
              size={20}
            />
          </div>

          {/* Credit boxes */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mb-6">
            {creditData.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedCreditsOption(index)}
                className={`cursor-pointer rounded-xl px-6 pt-6 py-7 border-2 transition-all duration-200 bg-[#0E0E0E] ${
                  selectedCreditsOption === index
                    ? "border-[#1189D3]"
                    : "border-[#0E0E0E] hover:border-[#1189D3]"
                } relative`}
              >
                {item.popular && (
                  <span className="absolute right-2 top-2 z-20 inline-block rounded-full text-sm font-medium text-white">
                    <span
                      className="absolute inset-0 rounded-[8px] border-[1px] border-transparent bg-gradient-to-r from-[#1489D4] via-[#0E2533] to-[#01558C] p-[1px]"
                      style={{
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    ></span>
                    <span className="relative z-10 px-3 py-1 text-[10px] font-extrabold bg-gradient-to-r from-[#1489D4] to-[#87C9F2] bg-clip-text text-transparent">
                      Most Popular
                    </span>
                  </span>
                )}
                {item.popular && (
                  <div
                    className="absolute top-0 right-5 w-[180px] h-[180px] z-10 opacity-50 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at top right, #8853FA, transparent 75%)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100%",
                      filter: "blur(30px)",
                    }}
                  ></div>
                )}
                <div className="flex flex-col gap-14">
                  <div className="flex flex-col gap-0">
                    <span className="text-[42px] font-medium">
                      {item.credits}
                    </span>
                    <span className="text-[16px] font-medium -mt-2">
                      Credits
                    </span>
                    <span className="text-[12px] font-medium text-[#ffffff]/60">
                      ₹{item.creditsPer} / credit
                    </span>
                  </div>
                  <div className="text-[20px] font-medium">${item.price}</div>
                  <div className="absolute right-0 bottom-6 bg-[#1288D3] rounded-l-[5px] text-[16px] font-medium px-6 py-1">
                    Save {item.discount}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Proceed button */}
          <div className="relative z-10 flex justify-center">
            <SecondaryButton
              onClick={Proceed}
              className={`w-[225px] ${
                selectedCreditsOption === null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={selectedCreditsOption === null}
            >
              Proceed
            </SecondaryButton>
          </div>
        </div>
      </Modal>

      {loading && (
        <div className="absolute inset-0 flex flex-col top-80 items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
}
