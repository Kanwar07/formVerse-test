
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Upload, Brain, Users, Search, User, LogOut, Plus, Image, X } from "lucide-react";
import { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className={`relative sticky top-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? "border-b border-white/20 bg-black/80 backdrop-blur-3xl supports-[backdrop-filter]:bg-black/60 shadow-2xl shadow-black/50" 
        : "border-b border-white/5 bg-transparent backdrop-blur-sm"
    }`}>
      {/* Enhanced background effects */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isScrolled ? "opacity-20" : "opacity-5"
      }`}>
        <div className="elegant-grid"></div>
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isScrolled 
          ? "bg-gradient-to-r from-cyber-blue/5 via-cyber-purple/3 to-cyber-pink/5 opacity-80" 
          : "bg-gradient-to-r from-cyber-blue/2 via-transparent to-cyber-purple/2 opacity-40"
      }`}></div>
      
      {/* Animated glow effect on scroll */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "h-14" : "h-16"
        }`}>
          {/* Logo Section - Enhanced with scroll behavior */}
          <div className="flex items-center flex-shrink-0">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => navigate("/")}
            >
              <div className={`relative transition-all duration-500 ease-out ${
                isScrolled ? "h-8 w-8" : "h-10 w-10"
              }`}>
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className={`elegant-glow-effect group-hover:animate-glow-pulse transition-all duration-500 ${
                    isScrolled ? "h-8 w-8" : "h-10 w-10"
                  }`}
                />
                {/* Enhanced glow effect on scroll */}
                {isScrolled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 blur-md opacity-50 animate-pulse"></div>
                )}
              </div>
              <span className={`font-space-grotesk font-bold tracking-tight transition-all duration-500 ${
                isScrolled ? "text-lg" : "text-xl"
              }`}>
                <span className="text-white">FORM</span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
              </span>
            </div>
          </div>
          
          {/* Navigation Links - Enhanced glass morphism with scroll response */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className={`flex items-center space-x-2 elegant-glass rounded-full backdrop-blur-2xl transition-all duration-500 ${
              isScrolled 
                ? "p-1.5 border border-white/20 bg-black/40 shadow-xl shadow-black/20" 
                : "p-2 border border-white/10 bg-white/5"
            }`}>
              <Button
                variant="ghost"
                onClick={() => navigate("/discover")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/discover") 
                    ? "bg-gradient-to-r from-cyber-blue/20 to-cyber-blue/10 text-white border border-cyber-blue/30 shadow-lg shadow-cyber-blue/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <Search className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Discover</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/creators")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/creators") 
                    ? "bg-gradient-to-r from-cyber-purple/20 to-cyber-purple/10 text-white border border-cyber-purple/30 shadow-lg shadow-cyber-purple/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <Users className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Creators</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/image-to-cad")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/image-to-cad") 
                    ? "bg-gradient-to-r from-cyber-green/20 to-cyber-green/10 text-white border border-cyber-green/30 shadow-lg shadow-cyber-green/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <Image className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Image to CAD</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/formiq-landing")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/formiq-landing") || isActivePath("/formiq") 
                    ? "bg-gradient-to-r from-cyber-pink/20 to-cyber-pink/10 text-white border border-cyber-pink/30 shadow-lg shadow-cyber-pink/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <Brain className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">FormIQ</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/pricing")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/pricing") 
                    ? "bg-gradient-to-r from-cyber-yellow/20 to-cyber-yellow/10 text-white border border-cyber-yellow/30 shadow-lg shadow-cyber-yellow/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-yellow/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <span className="relative z-10">Pricing</span>
              </Button>
            </div>
          </div>

          {/* Right Section - Enhanced with scroll response */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Twitter/X Link - Enhanced */}
            <a 
              href="https://x.com/FormverseD" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`group elegant-glass rounded-full transition-all duration-500 hover:scale-105 ${
                isScrolled 
                  ? "p-1.5 border border-white/20 bg-black/30 shadow-lg" 
                  : "p-2 border border-white/10 bg-white/5"
              }`}
            >
              <X className={`text-white/70 group-hover:text-white transition-all duration-300 ${
                isScrolled ? "h-3.5 w-3.5" : "h-4 w-4"
              }`} />
              {/* Enhanced glow on hover when scrolled */}
              {isScrolled && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-sm"></div>
              )}
            </a>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className={`group relative overflow-hidden elegant-glass border transition-all duration-500 hover:scale-105 ${
                    isScrolled 
                      ? "border-white/30 bg-gradient-to-r from-cyber-blue/15 to-cyber-purple/15 hover:from-cyber-blue/25 hover:to-cyber-purple/25 text-white text-sm rounded-full px-5 py-1.5 h-8 shadow-lg" 
                      : "border-white/20 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 hover:from-cyber-blue/20 hover:to-cyber-purple/20 text-white text-sm rounded-full px-6 py-2 h-9"
                  } font-medium hover:shadow-lg hover:shadow-cyber-blue/20`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  <Plus className={`mr-2 relative z-10 ${isScrolled ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
                  <span className="hidden sm:inline relative z-10">Upload</span>
                  {/* Enhanced glow effect when scrolled */}
                  {isScrolled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="group relative overflow-hidden elegant-glass border border-white/15 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-full px-4 py-2 h-9 font-medium transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                      <User className="h-4 w-4 mr-2 relative z-10" />
                      <span className="hidden sm:inline text-white/90 max-w-32 truncate relative z-10">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 elegant-glass border border-white/20 backdrop-blur-3xl bg-black/40 rounded-2xl p-2"
                  >
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")} 
                      className="hover:bg-white/10 text-white/90 rounded-xl m-1 px-3 py-2 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <User className="mr-3 h-4 w-4 text-white/70" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/upload")} 
                      className="hover:bg-white/10 text-white/90 rounded-xl m-1 px-3 py-2 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Upload className="mr-3 h-4 w-4 text-white/70" />
                      Upload Model
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20 my-2" />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-400 hover:bg-red-500/10 rounded-xl m-1 px-3 py-2 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2 elegant-glass rounded-full p-1 border border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm rounded-full px-4 py-2 h-8 font-medium transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="group relative overflow-hidden bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-white/20 text-white hover:from-cyber-blue/30 hover:to-cyber-purple/30 hover:border-white/30 text-sm rounded-full px-4 py-2 h-8 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/40 to-cyber-purple/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  <span className="relative z-10">Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
