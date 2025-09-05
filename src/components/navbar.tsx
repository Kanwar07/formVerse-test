
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const isHomePage = location.pathname === "/" || location.pathname === "/landing";

  const handleBack = () => {
    window.history.back();
  };

  const navLinks = [
    { path: '/discover', label: 'Discover' },
    { path: '/creators', label: 'Creators' },
    { path: '/image-to-cad', label: 'Image to CAD' },
    { path: '/formiq-landing', label: 'FormIQ' },
    { path: '/pricing', label: 'Pricing' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              {!isHomePage && (
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-2 group">
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-white tracking-tight">
                  FORMVERSE
                </span>
              </Link>
            </div>

            {/* Centered Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <nav className="flex items-center space-x-8">
                {navLinks.map((item) => {
                  const isActive = isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "relative text-sm font-medium transition-colors duration-200 py-2 group",
                        isActive 
                          ? "text-white" 
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      {item.label}
                      <span className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-200",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Section - Auth & Upload */}
            <div className="flex items-center space-x-3">
              
              {/* Upload Button - Only show if logged in */}
              {user && (
                <Button
                  asChild
                  className="hidden lg:flex bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105"
                >
                  <Link to="/upload">Upload</Link>
                </Button>
              )}

              {/* User Menu or Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10 rounded-full p-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="text-white hover:bg-white/10 cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/upload" className="text-white hover:bg-white/10 cursor-pointer lg:hidden">
                        Upload Model
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 hover:bg-white/10 cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Link to="/auth?mode=signin">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105"
                  >
                    <Link to="/auth?mode=signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/10 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 py-4 space-y-2">
              {navLinks.map((item) => {
                const isActive = isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive 
                        ? "text-white bg-white/10" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                {user ? (
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  >
                    <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                      Upload Model
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start"
                    >
                      <Link to="/auth?mode=signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    >
                      <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
