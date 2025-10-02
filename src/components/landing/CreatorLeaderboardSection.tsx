import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreatorCard from "./components/CreatorCard";

export function CreatorLeaderboardSection() {
  return (
    <section className="pt-20 pb-16">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Our CAD Creators</h2>
          <p className="text-muted-foreground">
            Empower anyone to create production-ready 3D assets from a simple
            text prompt or reference images in seconds
          </p>
        </div>

        <div className="flex flex-row justify-center gap-10">
          {[0, 1, 2].map((_, index) => (
            <CreatorCard key={index} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/creators">View All Creators</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
