
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Award, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  premium: boolean;
  rating: number;
  models: number;
  downloads: number;
  rank?: number;
}

const mockCreatorData: Creator[] = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "Industrial designer specializing in automotive and consumer electronics",
    premium: true,
    rating: 4.8,
    models: 47,
    downloads: 1240
  },
  {
    id: "2",
    name: "Jane Doe",
    username: "janedoe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "3D artist and product designer | Focus on healthcare and accessibility",
    premium: false,
    rating: 4.5,
    models: 32,
    downloads: 980
  },
  {
    id: "3",
    name: "Sam Smith",
    username: "samsmith",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "Mechanical engineer turned 3D designer | Robotics & IoT specialist",
    premium: true,
    rating: 4.7,
    models: 28,
    downloads: 1050
  },
  {
    id: "4",
    name: "Priya Sharma",
    username: "priyasharma",
    avatar: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "Architect & 3D visualizer | Sustainable design advocate",
    premium: false,
    rating: 4.6,
    models: 25,
    downloads: 850
  },
  {
    id: "5",
    name: "Alex Johnson",
    username: "alexjohnson",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "Product designer with focus on consumer electronics",
    premium: true,
    rating: 4.9,
    models: 36,
    downloads: 1120
  }
];

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
  
  // Sort creators based on selected criteria
  const sortedCreators = [...mockCreatorData].sort((a, b) => {
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
