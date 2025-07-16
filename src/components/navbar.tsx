
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Upload, Brain, Users, Search, User, LogOut, Plus, Image } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
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
    <nav className="border-b border-white/5 bg-black/30 backdrop-blur-3xl supports-[backdrop-filter]:bg-black/20 relative sticky top-0 z-50">
      <div className="absolute inset-0 elegant-grid opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/2 via-transparent to-cyber-purple/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => navigate("/")}
            >
              <div className="relative h-16 w-16">
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className="h-16 w-16 elegant-glow-effect group-hover:animate-glow-pulse transition-all duration-500"
                />
              </div>
              <span className="font-space-grotesk font-bold text-xl tracking-tight">
                <span className="text-white">FORM</span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
              </span>
            </div>
          </div>
          
          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-2 elegant-glass rounded-full p-2 border border-white/10 backdrop-blur-2xl">
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
                onClick={() => navigate("/formiq")}
                className={`group relative overflow-hidden rounded-full px-4 py-2 h-9 text-sm font-medium transition-all duration-300 ${
                  isActivePath("/formiq") 
                    ? "bg-gradient-to-r from-cyber-pink/20 to-cyber-pink/10 text-white border border-cyber-pink/30 shadow-lg shadow-cyber-pink/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
                <Brain className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">FormIQ</span>
              </Button>
            </div>
          </div>

          {/* Right Section - Theme Toggle & Auth */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="elegant-glass rounded-full p-1 border border-white/10">
              <ThemeToggle />
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className="group relative overflow-hidden elegant-glass border border-white/20 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 hover:from-cyber-blue/20 hover:to-cyber-purple/20 text-white hover:text-white text-sm rounded-full px-6 py-2 h-9 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  <Plus className="h-4 w-4 mr-2 relative z-10" />
                  <span className="hidden sm:inline relative z-10">Upload</span>
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
