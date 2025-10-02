import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreatorCard from "./components/CreatorCard";

export function CreatorLeaderboardSection() {
  return (
    <section className="pt-20 pb-10">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-[50px] font-bold mb-4 headingfont">
            Our CAD Creators
          </h2>
          <p className="text-muted-foreground text-[18px] subheadingfont">
            Empower anyone to create production-ready 3D assets from a <br />
            simple text prompt or reference images in seconds
          </p>
        </div>

        <div className="flex flex-row justify-center gap-4">
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
