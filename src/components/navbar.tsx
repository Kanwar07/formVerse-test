
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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="relative h-8 w-8 mr-2">
              <img 
                src="/lovable-uploads/9ce09c17-cfd4-43bc-a961-0bd805bee565.png" 
                alt="FormVerse Logo" 
                className="h-8 w-8"
              />
            </div>
            <span className="font-semibold text-lg">
              <span className="text-foreground">FORM</span>
              <span className="text-[#9b87f5]">VERSE</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant={isActivePath("/discover") ? "default" : "ghost"}
              onClick={() => navigate("/discover")}
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </Button>
            
            <Button
              variant={isActivePath("/creators") ? "default" : "ghost"}
              onClick={() => navigate("/creators")}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Creators</span>
            </Button>
            
            <Button
              variant={isActivePath("/image-to-cad") ? "default" : "ghost"}
              onClick={() => navigate("/image-to-cad")}
              className="flex items-center space-x-2"
            >
              <Image className="h-4 w-4" />
              <span>Image to CAD</span>
            </Button>
            
            <Button
              variant={isActivePath("/formiq") ? "default" : "ghost"}
              onClick={() => navigate("/formiq")}
              className="flex items-center space-x-2"
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
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Model</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/upload")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Model
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
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
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
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
