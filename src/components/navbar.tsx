
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Upload, Brain, Users, Search, User, LogOut, Plus, Image, Zap } from "lucide-react";
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
    <nav className="border-b border-white/10 bg-black/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/10 relative">
      <div className="absolute inset-0 elegant-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/2 via-transparent to-white/2"></div>
      
      <div className="container flex h-20 items-center justify-between relative z-10">
        <div className="flex items-center space-x-10">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="relative h-10 w-10 mr-2">
              <img 
                src="/lovable-uploads/9ce09c17-cfd4-43bc-a961-0bd805bee565.png" 
                alt="FormVerse Logo" 
                className="h-10 w-10 elegant-glow-effect group-hover:animate-glow-pulse transition-all duration-500"
              />
            </div>
            <span className="font-bold text-2xl matrix-text">
              <span className="text-white/95">FORM</span>
              <span className="text-white/80">VERSE</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant={isActivePath("/discover") ? "default" : "ghost"}
              onClick={() => navigate("/discover")}
              className={`elegant-button flex items-center space-x-2 text-sm rounded-2xl px-6 py-3 ${
                isActivePath("/discover") 
                  ? "bg-white/15 text-white border-white/25" 
                  : "hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </Button>
            
            <Button
              variant={isActivePath("/creators") ? "default" : "ghost"}
              onClick={() => navigate("/creators")}
              className={`elegant-button flex items-center space-x-2 text-sm rounded-2xl px-6 py-3 ${
                isActivePath("/creators") 
                  ? "bg-white/15 text-white border-white/25" 
                  : "hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Creators</span>
            </Button>
            
            <Button
              variant={isActivePath("/image-to-cad") ? "default" : "ghost"}
              onClick={() => navigate("/image-to-cad")}
              className={`elegant-button flex items-center space-x-2 text-sm rounded-2xl px-6 py-3 ${
                isActivePath("/image-to-cad") 
                  ? "bg-white/15 text-white border-white/25" 
                  : "hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              <Image className="h-4 w-4" />
              <span>Image to CAD</span>
            </Button>
            
            <Button
              variant={isActivePath("/formiq") ? "default" : "ghost"}
              onClick={() => navigate("/formiq")}
              className={`elegant-button flex items-center space-x-2 text-sm rounded-2xl px-6 py-3 ${
                isActivePath("/formiq") 
                  ? "bg-white/15 text-white border-white/25" 
                  : "hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>FormIQ</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/upload")}
                className="elegant-button flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 border-white/20 hover:border-white/30 text-sm rounded-2xl px-6 py-3"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Model</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="elegant-button flex items-center space-x-2 rounded-2xl px-4 py-3">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-white/90">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 elegant-glass border-white/20 backdrop-blur-2xl">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="hover:bg-white/10 text-white/90 rounded-xl m-1">
                    <User className="mr-3 h-4 w-4 text-white/70" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/upload")} className="hover:bg-white/10 text-white/90 rounded-xl m-1">
                    <Upload className="mr-3 h-4 w-4 text-white/70" />
                    Upload Model
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20 my-2" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10 rounded-xl m-1">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/signin")}
                className="elegant-button hover:bg-white/10 hover:text-white text-sm rounded-2xl px-6 py-3"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="elegant-button bg-gradient-to-r from-white/15 to-white/10 border-white/25 text-white hover:from-white/25 hover:to-white/15 hover:border-white/35 text-sm rounded-2xl px-6 py-3"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
