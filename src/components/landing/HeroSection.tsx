
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-gradient-to-br from-cyber-dark via-black to-cyber-darker">
      <div className="absolute inset-0 elegant-grid opacity-30"></div>
      <div className="absolute inset-0 elegant-particles"></div>
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl transform -translate-y-1/2 animate-glow-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-cyber-purple/5 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyber-blue/3 to-transparent rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container flex flex-col items-center text-center space-y-12 relative z-10">
        <div className="inline-flex items-center rounded-full elegant-glass border border-white/20 px-8 py-4 text-sm backdrop-blur-xl elegant-scan-line">
          <span className="matrix-text font-medium text-white/90">India's First AI-Powered CAD Launchpad</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight max-w-6xl leading-[0.9]">
          Turn your{" "}
          <span className="matrix-text bg-gradient-to-r from-white via-cyber-blue/80 to-white bg-clip-text text-transparent elegant-text-glow">
            CAD
          </span>{" "}
          into{" "}
          <span className="matrix-text bg-gradient-to-r from-white via-cyber-purple/80 to-white bg-clip-text text-transparent elegant-text-glow">
            capital
          </span>
        </h1>
        
        <p className="text-xl text-white/70 max-w-4xl leading-relaxed font-light">
          Upload, auto-tag, price, license, and validate printability of your 3D models using our proprietary AI system{" "}
          <span className="text-white/90 font-medium elegant-text-glow">FormIQ</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 pt-12">
          <Button size="lg" className="elegant-button bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white hover:from-white/20 hover:to-white/10 hover:border-white/30 text-lg px-10 py-5 rounded-2xl" asChild>
            <Link to="/dashboard">
              <span className="matrix-text font-medium">Start Creating</span>
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="elegant-button bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border-white/15 text-white/90 hover:from-cyber-blue/20 hover:to-cyber-purple/20 hover:border-white/25 text-lg px-10 py-5 rounded-2xl" asChild>
            <Link to="/discover">
              <span className="matrix-text font-medium">Browse Models</span>
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="elegant-button bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 border-white/15 text-white/90 hover:from-cyber-purple/20 hover:to-cyber-pink/20 hover:border-white/25 text-lg px-10 py-5 rounded-2xl" asChild>
            <Link to="/services">
              <span className="matrix-text font-medium">Hire Creators</span>
            </Link>
          </Button>
        </div>
        
        <div className="relative w-full h-[500px] md:h-[700px] mt-24">
          <div className="absolute inset-0 mx-auto w-full max-w-7xl">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-cyber-blue/5 rounded-3xl blur-3xl animate-glow-pulse"></div>
              <div className="relative w-full h-full elegant-glass rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden elegant-glow">
                <div className="w-full h-full bg-gradient-to-br from-cyber-dark/80 via-black/60 to-cyber-darker/80 flex items-center justify-center relative">
                  {/* Video Background */}
                  <iframe
                    src="https://www.youtube.com/embed/H6I3wHN4Yo4?autoplay=1&mute=1&loop=1&playlist=H6I3wHN4Yo4&controls=0&showinfo=0&rel=0&modestbranding=1"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    style={{
                      filter: 'brightness(0.8) contrast(1.2) saturate(1.1)',
                    }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Explainer Video"
                  />
                  
                  {/* Simplified overlay */}
                  <div className="absolute inset-0 z-10">
                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Central Logo/Brand */}
                  <div className="relative z-20 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center elegant-glass">
                      <div className="text-4xl font-bold matrix-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                        3D
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 matrix-text elegant-text-glow">CAD Revolution</h3>
                    <p className="text-sm text-white/60 mt-2">AI-Powered Design Intelligence</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5"></div>
                <div className="absolute inset-0 elegant-scan-line"></div>
                
                {/* Floating UI elements */}
                <div className="absolute top-8 left-8 elegant-glass px-6 py-3 rounded-2xl border border-white/20">
                  <span className="text-white/90 text-sm font-medium elegant-text-glow">AI Analysis: 97%</span>
                </div>
                
                <div className="absolute bottom-8 right-8 elegant-glass px-6 py-3 rounded-2xl border border-white/20">
                  <span className="text-white/90 text-sm font-medium elegant-text-glow">Printability: Optimal</span>
                </div>
                
                <div className="absolute top-1/2 right-8 elegant-glass px-6 py-3 rounded-2xl border border-white/20">
                  <span className="text-white/90 text-sm font-medium elegant-text-glow">FormIQ Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
