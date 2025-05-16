
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  transparent?: boolean;
  className?: string;
}

export function Navbar({ transparent = false, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md border-b",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            {/* Updated FormVerse logo - 3D cube with blue to purple gradient */}
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 25L50 5L80 25V75L50 95L20 75V25Z" fill="url(#logo-gradient)" />
              <path d="M50 50V95L20 75V25L50 5" stroke="url(#logo-stroke)" strokeWidth="3" fill="none" />
              <path d="M50 50H80V75L50 95" stroke="url(#logo-stroke)" strokeWidth="3" fill="none" />
              <defs>
                <linearGradient id="logo-gradient" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1EAEDB" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="logo-stroke" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1EAEDB" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-semibold text-lg">
            <span className="text-foreground">FORM</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6]">VERSE</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/discover" className="text-foreground/80 hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/#about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link to="/dashboard">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
