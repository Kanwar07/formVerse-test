
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

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
  const isHomePage = location.pathname === "/" || location.pathname === "/landing";

  const handleBack = () => {
    window.history.back();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-4">
        <div 
          className="flex items-center justify-between rounded-2xl border border-white/20 px-8 py-4 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}
        >
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            {!isHomePage && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBack();
                }}
                variant="ghost"
                size="sm"
                className="
                  flex items-center justify-center w-10 h-10 rounded-full 
                  bg-white/10 hover:bg-white/20 text-white border border-white/20
                  backdrop-blur-sm hover:scale-110 transition-all duration-200
                  mr-2
                "
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                alt="FormVerse Logo" 
                className="relative h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
            </div>
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-white group-hover:text-white/90 transition-colors duration-200">FORM</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-400 transition-all duration-300">VERSE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/10">
              {[
                { path: '/discover', label: 'Discover' },
                { path: '/creators', label: 'Creators' },
                { path: '/image-to-cad', label: 'Image to CAD' },
                { path: '/formiq-landing', label: 'FormIQ' },
                { path: '/pricing', label: 'Pricing' }
              ].map((item) => {
                const isActive = isActivePath(item.path) || (item.path === '/formiq-landing' && isActivePath('/formiq'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium 
                      transition-all duration-200 group whitespace-nowrap
                      ${isActive 
                        ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                   >
                     <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button
                  asChild
                  size="sm"
                  className="
                    bg-white/10 hover:bg-white/20 text-white border border-white/20 
                    rounded-full px-5 py-2 h-10 transition-all duration-200 backdrop-blur-sm
                    hover:shadow-lg hover:scale-105
                  "
                >
                   <Link to="/upload">
                     <span>Upload</span>
                   </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="
                        flex items-center space-x-2 text-white hover:text-white 
                        hover:bg-white/10 rounded-full px-3 py-2 h-10 
                        transition-all duration-200 group
                      "
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/30 to-blue-400/30 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-200">
                        <span className="text-sm font-semibold">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="
                    w-52 bg-black/90 backdrop-blur-xl border-white/20 rounded-2xl p-2
                    shadow-2xl shadow-black/50
                  ">
                    <DropdownMenuItem asChild>
                       <Link to="/dashboard" className="cursor-pointer text-white hover:text-purple-300 rounded-xl p-3 transition-colors duration-200">
                         Dashboard
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link to="/upload" className="cursor-pointer text-white hover:text-purple-300 rounded-xl p-3 transition-colors duration-200">
                         Upload Model
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10 my-2" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-400 hover:text-red-300 rounded-xl p-3 transition-colors duration-200"
                    >
                       Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="
                    text-white/80 hover:text-white hover:bg-white/10 
                    rounded-full px-5 py-2 h-10 transition-all duration-200
                    font-medium
                  "
                >
                  <Link to="/auth?mode=signin">Log In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="
                    relative overflow-hidden rounded-full px-6 py-2 h-10 font-semibold 
                    transition-all duration-300 border-none group hover:scale-105
                    shadow-lg hover:shadow-xl
                  "
                  style={{
                    background: 'linear-gradient(135deg, rgba(160, 233, 255, 0.3), rgba(138, 43, 226, 0.3))',
                    color: '#00d4ff',
                    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160, 233, 255, 0.5), rgba(138, 43, 226, 0.5))';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 212, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160, 233, 255, 0.3), rgba(138, 43, 226, 0.3))';
                    e.currentTarget.style.color = '#00d4ff';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)';
                  }}
                >
                   <Link to="/auth?mode=signup">
                     <span>Sign Up</span>
                   </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
