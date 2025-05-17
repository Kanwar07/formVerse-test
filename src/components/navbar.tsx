
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

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
            {/* Updated FormVerse logo with blue to purple gradient */}
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
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/discover" className="text-foreground/80 hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link 
            to="/formiq" 
            className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
          >
            <Brain className="h-4 w-4 text-[#9b87f5]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7E69AB] to-[#9b87f5]">FormIQ</span>
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
          <Button asChild className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
