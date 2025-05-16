
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <p className="relative text-7xl font-bold">404</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
