
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative container text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your designs into income?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of creators already using FormVerse to monetize their CAD models.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/discover">Explore Models</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
