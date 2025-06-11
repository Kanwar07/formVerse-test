
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Award, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreators } from "@/hooks/useCreators";

interface CreatorLeaderboardProps {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
}

export const CreatorLeaderboard = ({ 
  className, 
  limit = 5,
  showViewAll = true 
}: CreatorLeaderboardProps) => {
  const [sortBy, setSortBy] = useState<"downloads" | "rating" | "models">("downloads");
  const { creators, loading, error } = useCreators();
  
  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading creators...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load creators: {error}</p>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Top Creators</h3>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
          <p className="text-muted-foreground">No creators found. Upload the first model to get started!</p>
        </div>
      </div>
    );
  }
  
  // Sort creators based on selected criteria
  const sortedCreators = [...creators].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  }).slice(0, limit).map((creator, index) => ({
    ...creator,
    rank: index + 1
  }));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Top Creators</h3>
        <div className="flex gap-2">
          <Button 
            variant={sortBy === "downloads" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSortBy("downloads")}
          >
            Downloads
          </Button>
          <Button 
            variant={sortBy === "rating" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSortBy("rating")}
          >
            Rating
          </Button>
          <Button 
            variant={sortBy === "models" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSortBy("models")}
          >
            Models
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y">
          {sortedCreators.map((creator) => (
            <Link 
              key={creator.id}
              to={`/creator/${creator.username}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="font-semibold text-lg w-6 text-center">
                {creator.rank === 1 && <span className="text-amber-500">🏆</span>}
                {creator.rank !== 1 && creator.rank}
              </div>
              
              <Avatar className="h-12 w-12">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{creator.name}</span>
                  {creator.premium && (
                    <Badge variant="outline" className="bg-gradient-to-r from-[hsl(var(--formiq-blue))] to-[hsl(var(--formiq-purple))] text-white border-0 h-5 px-1.5">
                      <Star className="h-3 w-3 mr-0.5" />
                      <span className="text-xs">Pro</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{creator.bio}</p>
              </div>
              
              <div className="hidden md:flex gap-6 items-center text-sm">
                <div>
                  <div className="font-medium">{creator.models}</div>
                  <div className="text-xs text-muted-foreground">Models</div>
                </div>
                <div>
                  <div className="font-medium">{creator.downloads}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div>
                  <div className="flex items-center font-medium">
                    {creator.rating} <Star className="h-3 w-3 ml-0.5 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
              
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
        
        {showViewAll && (
          <div className="bg-muted/20 p-3 flex justify-center border-t">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/creators">View All Creators</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
