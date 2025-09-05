import { useState, useEffect } from "react";
import { Car, Plane, Heart, Smartphone, Building, Cpu, Cog, Film, Gamepad2, Printer, Headphones } from "lucide-react";

const CADGenres = [
  {
    name: "Film Production",
    icon: Film,
    color: "from-slate-600 to-slate-800",
    model: "🎬"
  },
  {
    name: "Product Design", 
    icon: Cpu,
    color: "from-blue-600/80 to-blue-800/80",
    model: "🔧"
  },
  {
    name: "Education",
    icon: Heart,
    color: "from-amber-600/80 to-amber-800/80",
    model: "🎓"
  },
  {
    name: "Game Development",
    icon: Gamepad2,
    color: "from-teal-600/80 to-teal-800/80",
    model: "⚔️"
  },
  {
    name: "3D Printing",
    icon: Printer,
    color: "from-emerald-600/80 to-emerald-800/80",
    model: "🏺"
  },
  {
    name: "VR/AR",
    icon: Headphones,
    color: "from-purple-600/80 to-purple-800/80",
    model: "🥽"
  },
  {
    name: "Interior Design",
    icon: Building,
    color: "from-rose-600/80 to-rose-800/80",
    model: "💡"
  }
];

export const CADGenresSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary/80 to-secondary/80 bg-clip-text text-transparent">
            CAD Models for Every Industry
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create stunning 3D models across multiple industries with our AI-powered platform
          </p>
        </div>

        {/* Horizontal Genre Cards */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {CADGenres.map((genre, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={genre.name}
                className="snap-center flex-shrink-0"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-48 h-64 group cursor-pointer">
                  {/* Card Background */}
                  <div className={`
                    absolute inset-0 rounded-3xl bg-gradient-to-br ${genre.color}
                    transition-all duration-500 ease-out
                    ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}
                  `} />
                  
                  {/* 3D Model Floating Above */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`
                      w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20
                      flex items-center justify-center text-3xl
                      transition-all duration-500 ease-out
                      ${isHovered 
                        ? 'animate-bounce scale-110 shadow-2xl bg-white/25' 
                        : 'animate-float shadow-lg'
                      }
                    `}>
                      <span className="filter drop-shadow-lg">
                        {genre.model}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg mb-2 drop-shadow-sm">
                        {genre.name}
                      </h3>
                      
                      {/* Animated Underline */}
                      <div className={`
                        w-0 h-0.5 bg-white/60 mx-auto transition-all duration-300
                        ${isHovered ? 'w-16' : 'w-8'}
                      `} />
                    </div>
                  </div>

                  {/* Floating Particles */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random()}s`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Glow Effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : ''}
                  `}>
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-br ${genre.color} 
                      blur-xl scale-110 opacity-50
                    `} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};