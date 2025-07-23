
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export function HeroSection() {
  console.log('HeroSection component loaded');
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (iframeRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      
      // Update iframe src with new mute parameter
      const currentSrc = iframeRef.current.src;
      const newSrc = currentSrc.replace(/mute=[01]/, `mute=${newMutedState ? 1 : 0}`);
      iframeRef.current.src = newSrc;
    }
  };

  const reloadVideo = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

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
          <span className="matrix-text font-medium text-white/90">Your cad files just got a brain</span>
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
                  {/* Video Background with better error handling */}
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/wI-bfQNbKrI?autoplay=1&mute=1&loop=1&playlist=wI-bfQNbKrI&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="FormVerse Explainer Video"
                    onLoad={() => setVideoLoaded(true)}
                    onError={() => console.log('Video failed to load')}
                  />
                  
                  {/* Fallback content if video doesn't load */}
                  {!videoLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-black to-cyber-darker flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto"></div>
                        <p className="text-white/60 text-lg">Loading video...</p>
                        <Button 
                          onClick={reloadVideo}
                          variant="outline" 
                          className="mt-4 border-white/20 text-white/80 hover:bg-white/10"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Click to load video
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-3 rounded-full elegant-glass border border-white/20 bg-black/50 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={reloadVideo}
                      className="p-3 rounded-full elegant-glass border border-white/20 bg-black/50 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      aria-label="Reload video"
                    >
                      <Play className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                      }}></div>
                    </div>
                  </div>
                  
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5"></div>
                <div className="absolute inset-0 elegant-scan-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
