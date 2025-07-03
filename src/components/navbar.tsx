
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
    <nav className="border-b border-cyber-blue/20 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/30 relative">
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-transparent to-cyber-purple/5"></div>
      
      <div className="container flex h-16 items-center justify-between relative z-10">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="relative h-8 w-8 mr-2">
              <img 
                src="/lovable-uploads/9ce09c17-cfd4-43bc-a961-0bd805bee565.png" 
                alt="FormVerse Logo" 
                className="h-8 w-8 neon-glow group-hover:animate-glow-pulse transition-all duration-300"
              />
            </div>
            <span className="font-bold text-xl matrix-text">
              <span className="text-cyber-blue">FORM</span>
              <span className="text-cyber-purple">VERSE</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant={isActivePath("/discover") ? "default" : "ghost"}
              onClick={() => navigate("/discover")}
              className={`cyber-button flex items-center space-x-2 ${
                isActivePath("/discover") 
                  ? "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50" 
                  : "hover:bg-cyber-blue/10 hover:text-cyber-blue hover:border-cyber-blue/30"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </Button>
            
            <Button
              variant={isActivePath("/creators") ? "default" : "ghost"}
              onClick={() => navigate("/creators")}
              className={`cyber-button flex items-center space-x-2 ${
                isActivePath("/creators") 
                  ? "bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50" 
                  : "hover:bg-cyber-purple/10 hover:text-cyber-purple hover:border-cyber-purple/30"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Creators</span>
            </Button>
            
            <Button
              variant={isActivePath("/image-to-cad") ? "default" : "ghost"}
              onClick={() => navigate("/image-to-cad")}
              className={`cyber-button flex items-center space-x-2 ${
                isActivePath("/image-to-cad") 
                  ? "bg-cyber-pink/20 text-cyber-pink border-cyber-pink/50" 
                  : "hover:bg-cyber-pink/10 hover:text-cyber-pink hover:border-cyber-pink/30"
              }`}
            >
              <Image className="h-4 w-4" />
              <span>Image to CAD</span>
            </Button>
            
            <Button
              variant={isActivePath("/formiq") ? "default" : "ghost"}
              onClick={() => navigate("/formiq")}
              className={`cyber-button flex items-center space-x-2 ${
                isActivePath("/formiq") 
                  ? "bg-cyber-green/20 text-cyber-green border-cyber-green/50" 
                  : "hover:bg-cyber-green/10 hover:text-cyber-green hover:border-cyber-green/30"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>FormIQ</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/upload")}
                className="cyber-button flex items-center space-x-2 bg-gradient-to-r from-cyber-blue/10 to-cyber-green/10 border-cyber-blue/30 hover:border-cyber-blue/50"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Model</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="cyber-button flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-cyber-blue">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 cyber-glass border-cyber-blue/30">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="hover:bg-cyber-blue/10 text-foreground">
                    <User className="mr-2 h-4 w-4 text-cyber-blue" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/upload")} className="hover:bg-cyber-blue/10 text-foreground">
                    <Upload className="mr-2 h-4 w-4 text-cyber-blue" />
                    Upload Model
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-cyber-blue/20" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-cyber-pink hover:bg-cyber-pink/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/signin")}
                className="cyber-button hover:bg-cyber-blue/10 hover:text-cyber-blue"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="cyber-button bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border-cyber-blue/50 text-cyber-blue hover:from-cyber-blue/30 hover:to-cyber-purple/30 hover:border-cyber-blue/70"
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
