
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreatorLeaderboard } from "@/components/CreatorLeaderboard";

export function CreatorLeaderboardSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Top CAD Creators</h2>
          <p className="text-muted-foreground">
            Discover and follow talented designers who are revolutionizing the CAD marketplace.
          </p>
        </div>
        
        <CreatorLeaderboard className="max-w-4xl mx-auto" />
        
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/creators">View All Creators</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
