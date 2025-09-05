
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
    { path: '/pricing', label: 'View All Plans' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-lg bg-black/10 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-4 min-w-0">
              {!isHomePage && (
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-full"
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className="h-9 w-9 transition-transform duration-200 group-hover:scale-105"
                />
                <span className="text-2xl font-bold text-white tracking-tight">
                  FORMVERSE
                </span>
              </Link>
            </div>

            {/* Centered Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto">
              <nav className="flex items-center space-x-10">
                {navLinks.map((item) => {
                  const isActive = isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "relative text-sm font-medium transition-all duration-300 py-2 group",
                        isActive 
                          ? "text-white" 
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      {item.label}
                      <span className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Section - Auth & Upload */}
            <div className="flex items-center space-x-4 min-w-0">
              
              {/* Upload Button - Only show if logged in */}
              {user && (
                <Button
                  asChild
                  className="hidden lg:flex bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 border-0"
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
                      className="text-white hover:bg-white/5 rounded-full p-2 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:bg-white/15">
                        <span className="text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="text-white hover:bg-white/5 cursor-pointer rounded-lg">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/upload" className="text-white hover:bg-white/5 cursor-pointer lg:hidden rounded-lg">
                        Upload Model
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 hover:bg-white/5 cursor-pointer rounded-lg"
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
                    className="text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-full px-4"
                  >
                    <Link to="/auth?mode=signin">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 border-0"
                  >
                    <Link to="/auth?mode=signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/5 p-2 rounded-full transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/5 py-6 space-y-3">
              {navLinks.map((item) => {
                const isActive = isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-6 py-3 text-base font-medium rounded-xl transition-all duration-200",
                      isActive 
                        ? "text-white bg-white/5" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-white/5 pt-6 space-y-3">
                {user ? (
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl h-12 font-medium"
                  >
                    <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                      Upload Model
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full text-white/60 hover:text-white hover:bg-white/5 justify-start h-12 rounded-xl"
                    >
                      <Link to="/auth?mode=signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl h-12 font-medium"
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
