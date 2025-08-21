import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HireMeTab } from "@/components/creator/HireMeTab";
import { 
  FileImage, 
  MessageSquare, 
  Share2, 
  Users, 
  Star,
  Award,
  ExternalLink,
  Briefcase
} from "lucide-react";

// Mock creator data (in a real app, this would come from API)
const mockCreators = [
  {
    id: "johndoe",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "Industrial designer specializing in automotive and consumer electronics | 5+ years experience in CAD",
    followers: 1240,
    following: 384,
    uploads: 47,
    location: "Mumbai, India",
    website: "johndoe.design",
    premium: true,
    rating: 4.8,
    featured: [
      {
        id: "model1",
        name: "Drone Propeller",
        image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop",
        likes: 342,
        downloads: 123
      },
      {
        id: "model2",
        name: "Phone Stand",
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1780&auto=format&fit=crop",
        likes: 210,
        downloads: 89
      },
      {
        id: "model3",
        name: "Mechanical Keyboard Case",
        image: "https://images.unsplash.com/photo-1567742562755-5a39c0c0c0a1?q=80&w=2069&auto=format&fit=crop",
        likes: 156,
        downloads: 64
      }
    ],
    tags: ["automotive", "electronics", "industrial", "professional"],
    achievements: [
      { name: "Design Excellence", icon: "trophy" },
      { name: "Top Seller", icon: "award" }
    ]
  },
  {
    id: "janedoe",
    name: "Jane Doe",
    username: "janedoe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&fit=crop&auto=format&fit=facearea&facepad=2&w=256&h=256",
    bio: "3D artist and product designer | Focus on healthcare and accessibility",
    followers: 980,
    following: 256,
    uploads: 32,
    location: "Bangalore, India",
    website: "janedoe.design",
    premium: false,
    rating: 4.5,
    featured: [
      {
        id: "model4",
        name: "Medical Device Enclosure",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1887&auto=format&fit=crop",
        likes: 186,
        downloads: 78
      }
    ],
    tags: ["healthcare", "accessibility", "product", "medical"],
    achievements: [
      { name: "Innovation Award", icon: "star" }
    ]
  }
];

const CreatorProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState("models");
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Find the creator based on URL parameter
  const creator = mockCreators.find(c => c.username === username) || mockCreators[0];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Navbar />
      
      <main className="flex-grow container py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <h1 className="text-2xl font-semibold">{creator.name}</h1>
                {creator.premium && (
                  <Badge variant="outline" className="bg-gradient-to-r from-[hsl(var(--formiq-blue))] to-[hsl(var(--formiq-purple))] text-white border-0">
                    <Star className="h-3.5 w-3.5 mr-1" /> Premium Creator
                  </Badge>
                )}
              </div>
              
              <div className="text-muted-foreground mt-1">@{creator.username}</div>
              
              <p className="mt-3 text-foreground">{creator.bio}</p>
              
              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <span className="font-semibold">{creator.uploads}</span>{" "}
                  <span className="text-muted-foreground">Models</span>
                </div>
                <div>
                  <span className="font-semibold">{creator.followers}</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{creator.following}</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div>
                  <span className="font-semibold">{creator.rating}</span>{" "}
                  <span className="text-muted-foreground">Rating</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {creator.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className="whitespace-nowrap"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{creator.location}</span>
            </div>
            {creator.website && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a href={`https://${creator.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  {creator.website}
                </a>
              </div>
            )}
          </div>
          
          {creator.achievements && creator.achievements.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="text-sm font-medium mb-2">Achievements</div>
              <div className="flex gap-3">
                {creator.achievements.map(achievement => (
                  <Badge key={achievement.name} variant="outline" className="flex items-center gap-1 py-1.5">
                    {achievement.icon === "trophy" ? (
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    {achievement.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="models" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="models" className="flex gap-2">
              <FileImage className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="hire-me" className="flex gap-2">
              <Briefcase className="h-4 w-4" />
              Hire Me
            </TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-6">
            <h3 className="text-xl font-medium">Featured Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.featured && creator.featured.map(model => (
                <Card key={model.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video relative">
                    <img 
                      src={model.image} 
                      alt={model.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {model.downloads} downloads
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="ml-1">{model.likes}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {creator.featured && creator.featured.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">This creator hasn't uploaded any models yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hire-me" className="space-y-6">
            <HireMeTab 
              creatorName={creator.name}
              creatorRating={creator.rating}
              completedProjects={creator.uploads}
            />
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Collections Coming Soon</h3>
              <p className="text-muted-foreground">This feature is under development.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Activity Feed Coming Soon</h3>
              <p className="text-muted-foreground">This feature is under development.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorProfile;
