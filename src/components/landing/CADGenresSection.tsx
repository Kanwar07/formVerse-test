import { useState, useEffect } from "react";
import { Car, Plane, Heart, Smartphone, Building, Cpu, Cog } from "lucide-react";

const CADGenres = [
  {
    name: "Automotive Design",
    icon: Car,
    features: [
      "Aerodynamic Optimization",
      "Precision Engine Components",
      "Advanced Materials Testing"
    ],
    animation: "Vehicle chassis and components assembling with precision engineering details.",
    color: "from-primary to-primary/60"
  },
  {
    name: "Aerospace Engineering",
    icon: Plane,
    features: [
      "Lightweight Structural Design",
      "Turbine Blade Optimization",
      "Mission-Critical Reliability"
    ],
    animation: "Aircraft components and turbine assemblies forming with aerospace precision.",
    color: "from-secondary to-secondary/60"
  },
  {
    name: "Medical Devices",
    icon: Heart,
    features: [
      "Biocompatible Materials",
      "FDA-Compliant Design",
      "Patient-Specific Solutions"
    ],
    animation: "Medical implants and surgical instruments materializing with clinical precision.",
    color: "from-accent to-accent/60"
  },
  {
    name: "Consumer Products",
    icon: Smartphone,
    features: [
      "Ergonomic Design Excellence",
      "Mass Production Ready",
      "Market-Driven Innovation"
    ],
    animation: "Consumer electronics and household products forming with sleek modern aesthetics.",
    color: "from-primary/80 to-accent/60"
  },
  {
    name: "Architecture",
    icon: Building,
    features: [
      "Structural Integrity Analysis",
      "Sustainable Building Design",
      "BIM Integration Ready"
    ],
    animation: "Architectural structures and building components constructing with structural detail.",
    color: "from-secondary/80 to-primary/60"
  },
  {
    name: "Electronics",
    icon: Cpu,
    features: [
      "PCB Layout Optimization",
      "Thermal Management",
      "Signal Integrity Analysis"
    ],
    animation: "Circuit boards and electronic components assembling with micro-precision detail.",
    color: "from-accent/80 to-secondary/60"
  },
  {
    name: "Industrial Equipment",
    icon: Cog,
    features: [
      "Heavy-Duty Performance",
      "Safety-First Design",
      "Operational Efficiency"
    ],
    animation: "Industrial machinery and equipment forming with robust engineering excellence.",
    color: "from-primary/60 to-secondary/80"
  }
];

export const CADGenresSection = () => {
  const [activeGenre, setActiveGenre] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('cad-genres-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGenre((prev) => (prev + 1) % CADGenres.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="cad-genres-section" className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 elegant-grid opacity-20"></div>
      <div className="absolute inset-0 elegant-particles"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '-1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary/80 to-secondary/80 bg-clip-text text-transparent">
            CAD Models for Every Industry
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From automotive to aerospace, medical to consumer products - FormVerse creators design precision CAD models across all industries
          </p>
        </div>

        {/* Main Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Genre List */}
          <div className="space-y-4">
            {CADGenres.map((genre, index) => {
              const Icon = genre.icon;
              const isActive = index === activeGenre;
              
              return (
                <div
                  key={genre.name}
                  className={`
                    group cursor-pointer transition-all duration-500 rounded-2xl p-6
                    ${isActive 
                      ? 'elegant-glass border-primary/30 scale-105' 
                      : 'bg-card/20 border border-border/50 hover:bg-card/40'
                    }
                  `}
                  onClick={() => setActiveGenre(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${genre.color} shadow-lg animate-glow-pulse` 
                        : 'bg-muted/20'
                      }
                    `}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`
                        text-lg font-semibold mb-2 transition-colors duration-300
                        ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                      `}>
                        {genre.name}
                      </h3>
                      
                      {isActive && (
                        <div className="animate-fade-in">
                          <div className="grid grid-cols-1 gap-2 mb-3">
                            {genre.features.map((feature, fIndex) => (
                              <div 
                                key={feature} 
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                                style={{ animationDelay: `${fIndex * 100}ms` }}
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-glow-pulse"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground/80 italic">
                            {genre.animation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated 3D Visualization Area */}
          <div className="relative">
            <div className="elegant-glass rounded-3xl p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden">
              
              {/* Background Animation Elements */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute w-2 h-2 rounded-full opacity-30 animate-float
                      ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}
                    `}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* Central 3D Model Representation */}
              <div className="relative z-10">
                <div className={`
                  w-80 h-80 rounded-full flex items-center justify-center transition-all duration-1000
                  bg-gradient-to-br ${CADGenres[activeGenre].color} animate-glow-pulse
                  shadow-2xl
                `}>
                  
                  {/* Rotating Ring Elements */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow"></div>
                  <div className="absolute inset-4 rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
                  <div className="absolute inset-8 rounded-full border border-white/5 animate-spin-slow" style={{ animationDuration: '25s' }}></div>
                  
                  {/* Center Icon */}
                  <div className="relative z-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    {(() => {
                      const Icon = CADGenres[activeGenre].icon;
                      return <Icon className="w-16 h-16 text-white animate-glow-pulse" />;
                    })()}
                  </div>
                  
                  {/* Scanning Lines */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-glow"></div>
                  </div>
                </div>
                
                {/* Orbiting Elements */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-white/40 rounded-full animate-spin-slow"
                    style={{
                      left: '50%',
                      top: '50%',
                      transformOrigin: `${120 + i * 20}px center`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${8 + i}s`
                    }}
                  />
                ))}
              </div>

              {/* Industry Label */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 animate-fade-in">
                    {CADGenres[activeGenre].name}
                  </h3>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto animate-slide-glow"></div>
                </div>
              </div>
            </div>
            
            {/* Progress Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {CADGenres.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300 cursor-pointer
                    ${index === activeGenre 
                      ? 'bg-primary w-8 animate-glow-pulse' 
                      : 'bg-muted/40 hover:bg-muted/60'
                    }
                  `}
                  onClick={() => setActiveGenre(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Create Industry-Leading CAD Models?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are revolutionizing design across industries with FormVerse's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="elegant-button">
              Start Creating Today
            </button>
            <button className="elegant-button bg-transparent border-primary/30 hover:border-primary/50">
              Explore Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};