
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background/50 to-muted/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-accent/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="container flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-medium">India's First Launchpad for CAD Creators</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
          Turn your <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">CAD</span> into <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">capital</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Upload, auto-tag, price, license, and validate printability of your 3D models using our proprietary AI system FormIQ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300" asChild>
            <Link to="/dashboard">Start Creating</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 transition-all duration-300" asChild>
            <Link to="/discover">Browse Models</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-accent/20 hover:bg-accent/5 transition-all duration-300" asChild>
            <Link to="/services">Hire Creators</Link>
          </Button>
        </div>
        
        <div className="relative w-full h-[400px] md:h-[500px] mt-16">
          <div className="absolute inset-0 mx-auto w-full max-w-6xl">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-2xl blur-xl"></div>
              <div className="relative w-full h-full bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/8ce7b101-e889-47f8-a4e1-dc69243fe78a.png" 
                  alt="CAD Designer Working - From Design to Manufacturing" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
