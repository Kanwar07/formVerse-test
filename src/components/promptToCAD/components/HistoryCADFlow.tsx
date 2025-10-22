import { Grid3x3, History, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Funnel } from "@phosphor-icons/react";
import elephantVideo from "@/assets/PromptToCAD/elephantVideo.png";

export default function HistoryCADFlow() {
  const [quality, setQuality] = useState("high");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(0);

  const allStatus = [
    { id: 0, status: "All" },
    {
      id: 1,
      status: "Downloaded",
    },
    {
      id: 2,
      status: "Saved to dashboard",
    },
  ];

  const allOrder = [
    { id: 0, order: "Newest first" },
    {
      id: 1,
      order: "Oldest first",
    },
  ];
  return (
    <div className="p-8 w-full sm:w-[400px] md:w-[530px] md:h-[568px] bg-[#001F4C]/50 rounded-[20px] flex flex-col gap-6">
      <div className="flex flex-row justify-between mt-4">
        <span className="text-[18px] font-bold">History</span>
        <div className="flex flex-row gap-2">
          <Grid3x3 size={20} className="cursor-pointer" />
          <div
            className="relative"
            onMouseEnter={() => setShowFilters(true)}
            onMouseLeave={() => setShowFilters(false)}
          >
            <Funnel size={20} className="cursor-pointer" />

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-6 z-50">
                <div className="h-2 w-full" />
                <div className="w-[200px] bg-[#000914] rounded-[10px] p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                      <span className="text-[12px] font-bold">Status</span>
                      <History
                        size={14}
                        className="cursor-pointer text-white hover:text-[#ffffff]/70 transition-colors"
                      />
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                      {allStatus.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedStatus(item.id)}
                          className={`px-2 rounded-[4px] cursor-pointer transition-colors ${
                            selectedStatus === item.id
                              ? "bg-[#745CF4]"
                              : "bg-[#252525] hover:bg-[#745CF4]"
                          }`}
                        >
                          <span className="text-[12px] font-bold">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold">Order</span>
                    <div className="flex flex-row flex-wrap gap-1">
                      {allOrder.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedOrder(item.id)}
                          className={`px-2 rounded-[4px] cursor-pointer transition-colors ${
                            selectedOrder === item.id
                              ? "bg-[#745CF4]"
                              : "bg-[#252525] hover:bg-[#745CF4]"
                          }`}
                        >
                          <span className="text-[12px] font-bold">
                            {item.order}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-4 overflow-y-auto
      [scrollbar-width:thin] [scrollbar-color:#3A3A3A_transparent] 
  [&::-webkit-scrollbar]:w-2 
  [&::-webkit-scrollbar-track]:bg-white/50 
  [&::-webkit-scrollbar-thumb]:bg-[#ffffff1A] 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  hover:[&::-webkit-scrollbar-thumb]:bg-[#ffffff1A]"
      >
        <div className="flex flex-col gap-4">
          <span>Elephant in the room</span>
          <div className="flex flex-row gap-4">
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span>Elephant in the room</span>
          <div className="flex flex-row gap-4">
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span>Elephant in the room</span>
          <div className="flex flex-row gap-4">
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span>Elephant in the room</span>
          <div className="flex flex-row gap-4">
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
            <div className="border-2 border-[#FFFFFF1A] rounded-[8px]">
              <img
                src={elephantVideo}
                alt="Standard"
                className="h-[100px] object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
