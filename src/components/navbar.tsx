import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CircleUserRound,
  HandCoins,
  Image,
  Search,
  Settings,
  Type,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Button from "./common/Button";
import { DiscordLogoIcon } from "@phosphor-icons/react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPricingHovered, setIsPricingHovered] = useState(false);
  const [isFormIQHovered, setIsFormIQHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
  const isHomePage =
    location.pathname === "/" || location.pathname === "/landing";

  const isNavbarExtended = isFeaturesDropdownOpen || isCommunityDropdownOpen;

  const getNavbarBackground = () => {
    if (isNavbarExtended) {
      return "bg-[#021021]";
    }
    if (isScrolled) {
      return "bg-black/10 backdrop-blur-md";
    }
    return "bg-transparent";
  };

  const handleBack = () => {
    window.history.back();
  };

  const navLinks = [
    { path: "/discover", label: "Features" },
    { path: "/creators", label: "Community" },
    { path: "/studio", label: "Pricing" },
    { path: "/formiq-landing", label: "FormIQ" },
  ];

  const features = [
    {
      icon: <Image className="w-6 h-6 text-white" />,
      title: "Image to 3D",
      description: "Turn your concepts into fully ready to use models.",
      comingSoon: false,
    },
    {
      icon: <Type className="w-6 h-6 text-white" />,
      title: "Text to 3D",
      description: "Turn your ideas into fully ready to use models.",
      comingSoon: false,
    },
    {
      icon: <CircleUserRound className="w-6 h-6 text-white" />,
      title: "Hire a Creator",
      description: "Create a custom order for any requirements.",
      comingSoon: true,
    },
    {
      icon: <Settings className="w-6 h-6 text-white" />,
      title: "Autopilot CAD Editor",
      description: "Make AI generated models and customize them.",
      comingSoon: true,
    },
  ];
  const community = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Browse Models",
      description: "Browse through 1000+ AI optimised model library.",
      comingSoon: false,
    },
    {
      icon: <HandCoins className="w-6 h-6 text-primary" />,
      title: "Upload & Earn",
      description: "Upload your models and earn each time someone uses it.",
      comingSoon: false,
    },
    {
      icon: <CircleUserRound className="w-6 h-6 text-primary" />,
      title: "Creators",
      description: "Browse through our creators to look for that unique style.",
      comingSoon: false,
    },
    {
      icon: <DiscordLogoIcon className="w-6 h-6 text-primary" />,
      title: "Discord",
      description: "Join our discord channel to stay updated on the latest.",
      comingSoon: false,
    },
  ];

  return (
    <>
      {isNavbarExtended && <div className="fixed inset-0 bg-black/50 z-40" />}

      <nav className="fixed top-2 left-0 mx-2 right-0 z-50 subheadingfont">
        <div
          className={cn(
            "flex flex-col rounded-t-[16px] rounded-b-[40px] transition-all duration-300",
            getNavbarBackground()
          )}
        >
          <div className="flex items-center justify-between py-5 px-40">
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
              <Link to="/" className="flex items-center group">
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

            <div className="flex items-center gap-8">
              <div
                className="relative"
                onMouseEnter={() => setIsFeaturesDropdownOpen(true)}
                onMouseLeave={() => setIsFeaturesDropdownOpen(false)}
              >
                <div
                  className={`absolute -top-14 left-1/2 transform -translate-x-1/2 w-28 h-10 rounded-full transition-opacity duration-300 ${
                    isFeaturesDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #2A81FF 40%, #2A81FF80 40%, #11111100 100%)",
                    filter: "blur(12px)",
                  }}
                />

                <button className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors duration-200 py-2">
                  <span className="font-medium">Features</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isCommunityDropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 16l-6-6h12l-6 6z" />
                  </svg>
                </button>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setIsCommunityDropdownOpen(true)}
                onMouseLeave={() => setIsCommunityDropdownOpen(false)}
              >
                <div
                  className={`absolute -top-14 left-1/2 transform -translate-x-1/2 w-28 h-10 rounded-full transition-opacity duration-300 ${
                    isCommunityDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #2A81FF 40%, #2A81FF80 40%, #11111100 100%)",
                    filter: "blur(12px)",
                  }}
                />
                <button className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors duration-200 py-2">
                  <span className="font-medium">Community</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isCommunityDropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 16l-6-6h12l-6 6z" />
                  </svg>
                </button>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setIsPricingHovered(true)}
                onMouseLeave={() => setIsPricingHovered(false)}
              >
                <div
                  className={`absolute -top-14 left-1/2 transform -translate-x-1/2 w-28 h-10 rounded-full transition-opacity duration-300 ${
                    isPricingHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #2A81FF 40%, #2A81FF80 40%, #11111100 100%)",
                    filter: "blur(12px)",
                  }}
                />
                <Link
                  to="/pricing"
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Pricing
                </Link>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setIsFormIQHovered(true)}
                onMouseLeave={() => setIsFormIQHovered(false)}
              >
                <div
                  className={`absolute -top-14 left-1/2 transform -translate-x-1/2 w-28 h-10 rounded-full transition-opacity duration-300 ${
                    isFormIQHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #2A81FF 40%, #2A81FF80 40%, #11111100 100%)",
                    filter: "blur(12px)",
                  }}
                />
                <Link
                  to="/formio"
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
                >
                  FormIQ
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex flex-row items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, #97DBFF, #C2A6FF)",
                        WebkitMask:
                          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='17,8 12,3 7,8'/%3E%3Cline x1='12' y1='3' x2='12' y2='15'/%3E%3C/svg%3E\") no-repeat center",
                        WebkitMaskSize: "contain",
                        mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='17,8 12,3 7,8'/%3E%3Cline x1='12' y1='3' x2='12' y2='15'/%3E%3C/svg%3E\") no-repeat center",
                        maskSize: "contain",
                      }}
                    />
                  </div>
                  <span className="text-transparent bg-gradient-to-r from-[#97DBFF] to-[#C2A6FF] bg-clip-text font-medium">
                    Upload
                  </span>
                </div>
              </div>
              <Button className={`px-8`}>Login</Button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              isFeaturesDropdownOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
            onMouseEnter={() => setIsFeaturesDropdownOpen(true)}
            onMouseLeave={() => setIsFeaturesDropdownOpen(false)}
          >
            <div className="w-full p-4">
              <div className="grid grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="relative rounded-[28px] px-6 pt-6 pb-4 border border-[#0A8DD166] hover:border-[#0A8DD1] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group/card overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `
                        linear-gradient(
                        to top left,
                      #0A8DD199 0%,
                      #0A8DD180 10%,
                      #086CA660 25%,
                      #04325733 40%,
                      rgba(2,16,33,0) 50%,
                        transparent 100%
                        )
                        `,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "150% 150%",
                        backgroundPosition: "bottom right",
                        zIndex: 0,
                      }}
                    ></div>

                    {feature.comingSoon && (
                      <div className="absolute top-5 right-0 text-xs bg-[#03202F] text-[#ffffff] px-3 py-1.5 rounded-[6px] font-medium z-10">
                        Coming Soon
                      </div>
                    )}

                    <div className="relative z-10 mb-6 transition-transform duration-200">
                      {feature.icon}
                    </div>

                    <h3 className="relative z-10 font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>

                    <p className="relative z-10 text-sm text-[#FFFFFF99] leading-5 w-2/3">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              isCommunityDropdownOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
            onMouseEnter={() => setIsCommunityDropdownOpen(true)}
            onMouseLeave={() => setIsCommunityDropdownOpen(false)}
          >
            <div className="w-full p-4">
              <div className="grid grid-cols-4 gap-6">
                {community.map((feature, index) => (
                  <div
                    key={index}
                    className="relative rounded-[28px] px-6 pt-6 pb-4 border border-[#0A8DD166] hover:border-[#0A8DD1] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group/card overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `
                        linear-gradient(
                        to top left,
                      #0A8DD199 0%,
                      #0A8DD180 10%,
                      #086CA660 25%,
                      #04325733 40%,
                      rgba(2,16,33,0) 50%,
                        transparent 100%
                        )
                        `,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "150% 150%",
                        backgroundPosition: "bottom right",
                        zIndex: 0,
                      }}
                    ></div>

                    {feature.comingSoon && (
                      <div className="absolute top-5 right-0 text-xs bg-[#03202F] text-[#ffffff] px-3 py-1.5 rounded-[6px] font-medium z-10">
                        Coming Soon
                      </div>
                    )}

                    <div className="relative z-10 mb-6 transition-transform duration-200 text-white">
                      {feature.icon}
                    </div>

                    <h3 className="relative z-10 font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>

                    <p className="relative z-10 text-sm text-[#FFFFFF99] leading-5 w-2/3">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="flex items-center space-x-4 min-w-0">
              {user && (
                <Button
                  asChild
                  className="hidden lg:flex bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 border-0"
                >
                  <Link to="/upload">Upload</Link>
                </Button>
              )}

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
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="text-white hover:bg-white/5 cursor-pointer rounded-lg"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/upload"
                        className="text-white hover:bg-white/5 cursor-pointer lg:hidden rounded-lg"
                      >
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

              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/5 p-2 rounded-full transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div> */}
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5 py-6 space-y-3">
            {navLinks.map((item) => {
              const isActive =
                isActivePath(item.path) ||
                (item.path === "/formiq-landing" && isActivePath("/formiq"));
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
                    <Link
                      to="/auth?mode=signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl h-12 font-medium"
                  >
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
