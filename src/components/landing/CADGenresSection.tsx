import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export const CADGenresSection = () => {
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
      const newSrc = currentSrc.replace(
        /mute=[01]/,
        `mute=${newMutedState ? 1 : 0}`
      );
      iframeRef.current.src = newSrc;
    }
  };

  const reloadVideo = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#000000]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6">Smarter 3D Analysis</h2>
          <p className="text-xl text-muted-foreground">
            Instantly analyze models, get print-ready quotations, and order a
            professional print delivered to your <br /> door without leaving the
            platform
          </p>
        </div>

        <div className="relative w-full flex justify-center items-center">
          <div
            className="absolute inset-0 top-6 rounded-lg"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1489d8 0%, #1489d8 20%, #000000 90%)",
              filter: "blur(80px)",
              width: "100%",
              height: "100%",
            }}
          ></div>

          <div className="relative w-full h-[500px] md:h-[700px] mt-10">
            <div className="absolute inset-0 mx-auto w-full max-w-7xl">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-cyber-blue/5 rounded-3xl blur-3xl animate-glow-pulse"></div>
                <div className="relative w-full h-full elegant-glass rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden elegant-glow">
                  <div className="w-full h-full bg-gradient-to-br from-cyber-dark/80 via-black/60 to-cyber-darker/80 flex items-center justify-center relative">
                    {/* Video Background with better error handling */}
                    <iframe
                      ref={iframeRef}
                      //src={`https://www.youtube.com/embed/wI-bfQNbKrI?autoplay=1&mute=1&loop=1&playlist=wI-bfQNbKrI&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title="FormVerse Explainer Video"
                      onLoad={() => setVideoLoaded(true)}
                      onError={() => console.log("Video failed to load")}
                    />

                    {/* Fallback content if video doesn't load */}
                    {!videoLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-black to-cyber-darker flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto"></div>
                          <p className="text-white/60 text-lg">
                            Loading video...
                          </p>
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
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `
                          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                            backgroundSize: "50px 50px",
                          }}
                        ></div>
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
      </div>
    </section>
  );
};
