
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CADGenresSection } from "@/components/landing/CADGenresSection";
import { TabsSection } from "@/components/landing/TabsSection";
import { CreatorLeaderboardSection } from "@/components/landing/CreatorLeaderboardSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CADGenresSection />
      <TabsSection />
      <CreatorLeaderboardSection />
      <PricingSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
