
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
            <div className="absolute inset-0 bg-gradient-to-br from-formverse-teal to-formverse-indigo rounded-md animate-spin-slow"></div>
            <div className="absolute inset-[3px] bg-background rounded-md flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-formverse-teal"></div>
            </div>
          </div>
          <span className="font-semibold text-lg">FormVerse</span>
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
