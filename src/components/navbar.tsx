
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-5 py-2.5">
        <div 
          className="flex items-center justify-between h-auto rounded-xl border border-white/30 px-5 py-2.5"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        >
          {/* Navigation Links - From Discover to Sign Up */}
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group transition-colors duration-200" 
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <img 
                  src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                  alt="FormVerse Logo" 
                  className="h-8 w-8 transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">FORM</span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
              </span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { path: '/discover', label: 'Discover' },
                { path: '/creators', label: 'Creators' },
                { path: '/image-to-cad', label: 'Image to CAD' },
                { path: '/formiq-landing', label: 'FormIQ' },
                { path: '/pricing', label: 'Pricing' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group transition-all duration-200 pb-1"
                  style={{
                    fontSize: '1rem',
                    color: '#ffffff',
                  }}
                >
                  <span className="group-hover:text-[#a0e9ff] transition-colors duration-200">
                    {item.label}
                  </span>
                  <div 
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-[#a0e9ff] transition-all duration-200",
                      isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'))
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Auth Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full px-4 py-2 h-9 transition-all duration-200"
                  >
                    <Link to="/upload">Upload</Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 text-white hover:text-[#a0e9ff] hover:bg-white/10 rounded-full px-3 py-2 h-9 transition-all duration-200"
                      >
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-xs font-semibold">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-md border-white/20">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer text-white hover:text-[#a0e9ff]">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/upload" className="cursor-pointer text-white hover:text-[#a0e9ff]">
                          Upload Model
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-400 hover:text-red-300"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-[#a0e9ff] transition-colors duration-200 rounded-full px-4 py-2 h-9"
                  >
                    <Link to="/auth?mode=signin">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-[20px] px-4 py-2 h-9 font-semibold transition-all duration-200 border-none"
                    style={{
                      background: 'rgba(160, 233, 255, 0.25)',
                      color: '#00c8ff',
                      boxShadow: '0 4px 12px rgba(0, 200, 255, 0.5)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(160, 233, 255, 0.5)';
                      e.currentTarget.style.color = '#007da8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(160, 233, 255, 0.25)';
                      e.currentTarget.style.color = '#00c8ff';
                    }}
                  >
                    <Link to="/auth?mode=signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
