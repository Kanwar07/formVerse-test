import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CADGenresSection } from "@/components/landing/CADGenresSection";
import { UploadDesign } from "@/components/landing/UploadDesign";
import { CreatorLeaderboardSection } from "@/components/landing/CreatorLeaderboardSection";
import PricingSection from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import Testimonials from "@/components/landing/Testimonials";
import { Calendar } from "lucide-react";
import FAQSection from "@/components/landing/FAQSection";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CADGenresSection />
      <UploadDesign />

      <div className="relative bg-[#000000] rounded-b-[80px]">
        <div
          className="absolute inset-0 flex justify-center items-start z-10"
          style={{
            width: "100%",
            height: "80%",
            backgroundImage: `
              linear-gradient(to top, rgba(5,19,40,0.5) 0%, rgba(136,83,250,0.1) 10%),
              repeating-conic-gradient(
              from 0deg at 50% 100%,
            rgba(0,0,0,0.50) 0deg 10deg,
            rgba(0,0,0,0) 10deg 15deg
             )
            `,
            clipPath: "polygon(50% 100%, -20% 0%, 120% 0%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)",
            maskImage:
              "radial-gradient(circle at 50% 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        ></div>

        <div className="relative">
          <CreatorLeaderboardSection />
          <PricingSection />
        </div>
      </div>

      <div className="py-10 bg-[#000000] flex flex-row justify-center gap-20">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <div className="flex flex-row gap-1">
            <Calendar />
            100% Secure
          </div>
        ))}
      </div>

      <div className="bg-[#000000]">
        <div
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #051428 0%, #0B111B00 40%, #0B111B00 100%)",
          }}
          className="rounded-[80px] px-40"
        >
          <Testimonials />
          <FAQSection />
        </div>
      </div>

      <CTASection />
      <div className="bg-[#000000]">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
