
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-cyber-dark via-black to-cyber-darker">
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 floating-particles"></div>
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyber-blue/10 to-transparent rounded-full blur-3xl transform -translate-y-1/2 animate-glow-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-cyber-purple/10 to-transparent rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-cyber-pink/5 to-transparent rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container flex flex-col items-center text-center space-y-8 relative z-10">
        <div className="inline-flex items-center rounded-full cyber-glass border border-cyber-blue/30 px-6 py-3 text-sm backdrop-blur-sm scan-line">
          <span className="matrix-text font-medium">India's First AI-Powered CAD Launchpad</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight max-w-5xl leading-tight">
          Turn your{" "}
          <span className="matrix-text bg-gradient-to-r from-cyber-blue via-cyber-green to-cyber-blue bg-clip-text text-transparent animate-glow-pulse">
            CAD
          </span>{" "}
          into{" "}
          <span className="matrix-text bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-purple bg-clip-text text-transparent animate-glow-pulse" style={{animationDelay: '0.5s'}}>
            capital
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Upload, auto-tag, price, license, and validate printability of your 3D models using our proprietary AI system{" "}
          <span className="text-cyber-blue font-semibold">FormIQ</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 pt-8">
          <Button size="lg" className="cyber-button bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 border-cyber-blue/50 text-cyber-blue hover:from-cyber-blue/30 hover:to-cyber-green/30 hover:border-cyber-blue/70 text-lg px-8 py-4" asChild>
            <Link to="/dashboard">
              <span className="matrix-text">Start Creating</span>
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="cyber-button bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 border-cyber-purple/50 text-cyber-purple hover:from-cyber-purple/20 hover:to-cyber-pink/20 hover:border-cyber-purple/70 text-lg px-8 py-4" asChild>
            <Link to="/discover">
              <span className="matrix-text">Browse Models</span>
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="cyber-button bg-gradient-to-r from-cyber-pink/10 to-cyber-yellow/10 border-cyber-pink/50 text-cyber-pink hover:from-cyber-pink/20 hover:to-cyber-yellow/20 hover:border-cyber-pink/70 text-lg px-8 py-4" asChild>
            <Link to="/services">
              <span className="matrix-text">Hire Creators</span>
            </Link>
          </Button>
        </div>
        
        <div className="relative w-full h-[400px] md:h-[600px] mt-20">
          <div className="absolute inset-0 mx-auto w-full max-w-7xl">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 via-transparent to-cyber-purple/20 rounded-3xl blur-2xl animate-glow-pulse"></div>
              <div className="relative w-full h-full cyber-glass rounded-3xl border-2 border-cyber-blue/30 shadow-2xl overflow-hidden hologram-effect">
                <img 
                  src="/lovable-uploads/8ce7b101-e889-47f8-a4e1-dc69243fe78a.png" 
                  alt="CAD Designer Working - From Design to Manufacturing" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/40 via-transparent to-cyber-dark/20"></div>
                <div className="absolute inset-0 scan-line"></div>
                
                {/* Floating UI elements */}
                <div className="absolute top-6 left-6 cyber-glass px-4 py-2 rounded-xl border border-cyber-blue/30">
                  <span className="text-cyber-blue text-sm font-medium">AI Analysis: 97%</span>
                </div>
                
                <div className="absolute bottom-6 right-6 cyber-glass px-4 py-2 rounded-xl border border-cyber-green/30">
                  <span className="text-cyber-green text-sm font-medium">Printability: Optimal</span>
                </div>
                
                <div className="absolute top-1/2 right-6 cyber-glass px-4 py-2 rounded-xl border border-cyber-purple/30">
                  <span className="text-cyber-purple text-sm font-medium">FormIQ Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
