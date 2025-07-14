
import { useEffect, useState } from "react";

interface CADTool {
  name: string;
  logo: string;
  description: string;
}

const cadTools: CADTool[] = [
  {
    name: "Fusion 360",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center",
    description: "Cloud-based 3D CAD/CAM/CAE with AI-powered generative design"
  },
  {
    name: "SolidWorks",
    logo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=center",
    description: "Parametric design with intelligent feature recognition"
  },
  {
    name: "AutoCAD",
    logo: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&crop=center",
    description: "AI-enhanced 2D/3D drafting with smart automation tools"
  },
  {
    name: "Blender",
    logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=center",
    description: "Open-source 3D creation with AI geometry nodes"
  },
  {
    name: "Rhino 3D",
    logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&h=100&fit=crop&crop=center",
    description: "NURBS modeling with Grasshopper algorithmic design"
  },
  {
    name: "SketchUp",
    logo: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop&crop=center",
    description: "Intuitive 3D modeling with AI-powered layout suggestions"
  },
  {
    name: "Inventor",
    logo: "https://images.unsplash.com/photo-1581092787765-e3d8d5f66e97?w=100&h=100&fit=crop&crop=center",
    description: "Professional mechanical design with simulation integration"
  },
  {
    name: "CATIA",
    logo: "https://images.unsplash.com/photo-1581092918484-8ae83a4b4223?w=100&h=100&fit=crop&crop=center",
    description: "Advanced surface modeling for aerospace & automotive"
  }
];

export function CADToolsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cadTools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-cyber-dark/50 via-black/80 to-cyber-darker/50">
      <div className="absolute inset-0 elegant-grid opacity-10"></div>
      <div className="absolute inset-0 elegant-particles"></div>
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-cyber-blue/5 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-t from-cyber-purple/5 to-transparent blur-3xl"></div>
      
      <div className="container relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="matrix-text bg-gradient-to-r from-white via-cyber-blue/80 to-white bg-clip-text text-transparent elegant-text-glow">
              Design with AI
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Use these powerful CAD AI tools to create your designs, then bring them to{" "}
            <span className="text-white font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span>{" "}
            to monetize your creativity
          </p>
        </div>

        {/* Moving Slider Container */}
        <div className="relative">
          <div className="elegant-glass border border-white/10 rounded-3xl p-8 backdrop-blur-xl overflow-hidden">
            {/* Sliding Track */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out gap-8"
              style={{ 
                transform: `translateX(-${currentIndex * (300 + 32)}px)`,
                width: `${cadTools.length * (300 + 32)}px`
              }}
            >
              {cadTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`flex-shrink-0 w-[300px] h-[200px] relative transition-all duration-500 ${
                    index === currentIndex 
                      ? 'scale-110 z-10' 
                      : index === (currentIndex + 1) % cadTools.length || 
                        index === (currentIndex - 1 + cadTools.length) % cadTools.length
                      ? 'scale-95 opacity-60'
                      : 'scale-90 opacity-30'
                  }`}
                >
                  <div className="elegant-glass h-full rounded-2xl border border-white/20 p-6 flex flex-col items-center justify-center space-y-4 elegant-glow">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden elegant-glass border border-white/20">
                      <img 
                        src={tool.logo} 
                        alt={`${tool.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Tool Name */}
                    <h3 className="text-xl font-bold text-white matrix-text elegant-text-glow">
                      {tool.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-white/60 text-center leading-relaxed">
                      {tool.description}
                    </p>
                    
                    {/* Animated indicator */}
                    {index === currentIndex && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-cyber-blue rounded-full animate-glow-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {cadTools.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-cyber-blue shadow-lg shadow-cyber-blue/50 scale-125'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Demo CAD Preview */}
        <div className="text-center space-y-8">
          <div className="elegant-glass border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white matrix-text elegant-text-glow">
                Experience Our 3D CAD Viewer
              </h3>
              <p className="text-white/70 leading-relaxed">
                See how your CAD models will look with our advanced Three.js-powered viewer
              </p>
              
              {/* Demo 3D Viewer - Simplified */}
              <div className="h-[400px] rounded-xl overflow-hidden border border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center text-white/70">
                  <div className="w-16 h-16 mx-auto mb-4 bg-cyber-blue/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11l7 5 7-5V7l-7-5z" stroke="currentColor" strokeWidth="1" fill="none"/>
                      <path d="M10 2v16M3 7l7 5 7-5" stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                  </div>
                  <p className="text-sm">3D CAD Viewer Preview</p>
                  <p className="text-xs text-white/50 mt-1">Upload your models to see them here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-8">
          <div className="elegant-glass border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white matrix-text elegant-text-glow">
                Ready to Upload Your Design?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Create stunning CAD models with these AI-powered tools, then upload to <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> 
                to license, sell, and validate your designs with our proprietary{" "}
                <span className="text-cyber-blue font-medium">FormIQ</span> technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button className="elegant-button bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border-white/20 text-white hover:from-cyber-blue/30 hover:to-cyber-purple/30 hover:border-white/30 px-8 py-3 rounded-xl">
                  <span className="matrix-text font-medium">Start Uploading</span>
                </button>
                <button className="elegant-button bg-gradient-to-r from-white/5 to-white/10 border-white/15 text-white/90 hover:from-white/10 hover:to-white/15 hover:border-white/25 px-8 py-3 rounded-xl">
                  <span className="matrix-text font-medium">Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 elegant-glass px-4 py-2 rounded-xl border border-white/20">
        <span className="text-white/80 text-sm matrix-text">AI-Powered</span>
      </div>
      
      <div className="absolute bottom-20 right-10 elegant-glass px-4 py-2 rounded-xl border border-white/20">
        <span className="text-white/80 text-sm matrix-text">Professional Grade</span>
      </div>
      
      <div className="absolute top-1/2 left-5 elegant-glass px-4 py-2 rounded-xl border border-white/20">
        <span className="text-white/80 text-sm matrix-text">Industry Standard</span>
      </div>
    </section>
  );
}
