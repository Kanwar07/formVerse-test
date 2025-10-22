import Button from "@/components/common/Button";

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 mt-24">
      <span className="text-[16px] font-bold">Initializing</span>
      <div className="flex flex-row gap-2">
        <div className="relative h-[4px] w-[150px] rounded-[8px] bg-[#D9D9D9]/20 overflow-hidden">
          <span className="absolute inset-0 bg-[#443694] rounded-[8px] animate-[fillBar_1.5s]"></span>
        </div>
        <div className="relative h-[4px] w-[150px] rounded-[8px] bg-[#D9D9D9]/20 overflow-hidden">
          <span className="absolute inset-0 bg-[#443694] rounded-[8px] animate-[fillBar_1.5s_0.3s]"></span>
        </div>
        <div className="relative h-[4px] w-[150px] rounded-[8px] bg-[#D9D9D9]/20 overflow-hidden">
          <span className="absolute inset-0 bg-[#443694] rounded-[8px] animate-[fillBar_1.5s_0.6s]"></span>
        </div>
      </div>
      <div className="text-[16px] font-bold mt-20">
        Waiting? Explore models while you do
      </div>
      <Button>Explore</Button>
      <style>{`
        @keyframes fillBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
