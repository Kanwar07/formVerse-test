
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-muted/30 via-background to-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About <span className="font-space-grotesk bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span></h2>
            <p className="text-muted-foreground mb-4">
              <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> is India's first AI-powered platform dedicated to helping CAD creators monetize their designs while providing OEMs with access to high-quality, verified 3D models.
            </p>
            <p className="text-muted-foreground mb-4">
              Our proprietary AI system, FormIQ, helps validate model printability, suggest optimal pricing, and ensure designs meet industry standards before they reach the marketplace.
            </p>
            <p className="text-muted-foreground">
              Founded in 2023, we're on a mission to bridge the gap between CAD creators and manufacturers, fostering innovation and growth in India's 3D printing and manufacturing ecosystem.
            </p>
            <Button variant="outline" className="mt-6">Learn More</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
              alt="About FormVerse" 
              className="relative z-10 rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
