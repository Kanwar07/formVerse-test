
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Upload, Brain, Users, Search, User, LogOut, Plus, Image, Twitter } from "lucide-react";

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
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate("/")}
            >
              <div className="relative h-8 w-8">
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className="h-8 w-8"
                />
              </div>
              <span className="font-semibold text-lg">
                FormVerse
              </span>
            </div>
          </div>
          
          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/discover")}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/discover") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Discover
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate("/creators")}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/creators") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Creators
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate("/image-to-cad")}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/image-to-cad") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Image to CAD
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate("/formiq")}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/formiq") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              FormIQ
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/pricing")}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/pricing") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Pricing
            </Button>
          </div>

          {/* Right Section - Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className="text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline max-w-32 truncate">
                        {user.email}
                      </span>
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
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-6"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
