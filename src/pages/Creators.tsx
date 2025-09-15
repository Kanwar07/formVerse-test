
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CreatorLeaderboard } from "@/components/CreatorLeaderboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const Creators = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container py-8 flex-grow pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4"><span className="font-space-grotesk bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> Creators</h1>
            <p className="text-xl text-muted-foreground">
              Discover talented CAD designers from around India
            </p>
          </div>
          
          <div className="flex gap-3 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>Search</Button>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All Creators</TabsTrigger>
                <TabsTrigger value="industrial">Industrial Design</TabsTrigger>
                <TabsTrigger value="consumer">Consumer Products</TabsTrigger>
                <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CreatorLeaderboard limit={4} showViewAll={false} showLoadMore={true} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Creators;
