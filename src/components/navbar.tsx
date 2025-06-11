
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Brain, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavbarProps {
  transparent?: boolean;
  className?: string;
}

export function Navbar({ transparent = false, className }: NavbarProps) {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
          <Link to="/services" className="text-foreground/80 hover:text-foreground transition-colors">
            Hire Creators
          </Link>
          {user && (
            <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
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
          {loading ? (
            <div className="w-20 h-10 bg-muted rounded animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user.email?.split('@')[0] || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/upload">Upload Model</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                <Link to="/signin">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
