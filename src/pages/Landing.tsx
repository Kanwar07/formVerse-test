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
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CADGenresSection />
      <UploadDesign />

      <div className="relative rounded-b-[80px]">
        <div className="relative z-30">
          <CreatorLeaderboardSection />
        </div>

        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            height: "100%",
            width: "100%",
            background:
              "linear-gradient(to top, rgba(5, 19, 40, 0.21) 0%, rgba(136, 83, 250, 0) 100%)",
            filter: "blur(17px)",
          }}
        ></div>
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background: `
      conic-gradient(
        from 180deg at 50% 70%,
        rgba(136, 83, 250, 0.45) 0deg,
        rgba(63, 94, 251, 0.2) 60deg,
        rgba(136, 83, 250, 0.05) 120deg,
        rgba(5, 19, 40, 0.2) 180deg,
        rgba(136, 83, 250, 0.05) 240deg,
        rgba(63, 94, 251, 0.2) 300deg,
        rgba(136, 83, 250, 0.45) 360deg
      )
    `,
            maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 60%, transparent 100%)",
            filter: "blur(10px)",
            opacity: 0.1,
          }}
        ></div>

        <div className="relative z-20">
          <PricingSection />
        </div>
      </div>

      <div className="py-10 bg-[#000000] flex flex-row justify-center gap-20 subheadingfont">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <div className="flex flex-row gap-1">
            <Calendar />
            100% Secure
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #051428 0%, #0B111B00 80%, #0D0D0D 100%)",
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
