import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  duration?: number;
}

export function LoadingSpinner({ 
  size = "lg", 
  showText = true, 
  duration = 2000 
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16", 
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        {/* Rotating FormVerse Logo */}
        <div className="relative">
          {/* Glow effect background */}
          <div className={`${sizeClasses[size]} absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-full blur-xl animate-pulse`}></div>
          
          {/* Main logo */}
          <img 
            src="/lovable-uploads/7ba397cf-e713-44e7-8854-a7fdf2ac3f49.png"
            alt="FormVerse Loading"
            className={`${sizeClasses[size]} relative z-10 animate-spin`}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))',
              animationDuration: '2s',
              animationTimingFunction: 'linear'
            }}
          />
          
          {/* Orbit ring */}
          <div 
            className={`${sizeClasses[size]} absolute inset-0 border-2 border-purple-500/30 rounded-full animate-spin`}
            style={{
              animationDuration: '3s',
              animationDirection: 'reverse'
            }}
          ></div>
        </div>

        {/* Loading text */}
        {showText && (
          <div className="text-center space-y-2">
            <h2 className={`font-space-grotesk font-bold ${textSizeClasses[size]} tracking-tight`}>
              <span className="text-white">FORM</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
            </h2>
            <div className="flex items-center space-x-1 text-white/70">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-white/60 text-sm">Loading your CAD marketplace</p>
          </div>
        )}

        {/* Progress indicator */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse"
          ></div>
        </div>
      </div>

      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}