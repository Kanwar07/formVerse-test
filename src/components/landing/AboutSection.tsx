
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-muted/30 via-background to-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About <span className="font-space-grotesk bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span></h2>
            <p className="text-muted-foreground mb-4">
              <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> is India's pioneering global CAD marketplace, revolutionizing how designers monetize their creativity while connecting manufacturers with premium, AI-validated 3D models and designs.
            </p>
            <p className="text-muted-foreground mb-4">
              Powered by our cutting-edge FormIQ AI engine, we analyze design complexity, optimize pricing strategies, validate printability scores, and ensure every model meets the highest quality standards for modern manufacturing needs.
            </p>
            <p className="text-muted-foreground">
              Founded in 2025, we're transforming the future of design commerce by empowering creators to turn their CAD expertise into sustainable income while accelerating innovation across India's rapidly expanding manufacturing and 3D printing industries.
            </p>
            <Button variant="outline" className="mt-6">Learn More</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
            <img 
              src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
              alt="About FormVerse" 
              className="relative z-10 rounded-3xl shadow-xl bg-white p-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
