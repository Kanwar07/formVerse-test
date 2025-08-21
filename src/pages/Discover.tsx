
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Model3DThumbnail } from "@/components/dashboard/Model3DThumbnail";
import { Search, Download, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Model {
  id: string;
  name: string;
  description: string;
  file_path: string;
  file_type: string;
  preview_image: string | null;
  price: number;
  tags: string[];
  downloads: number;
  view_count: number;
  printability_score: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    email: string;
    avatar_url: string;
  } | null;
}

const Discover = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModels();
  }, [sortBy]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('models')
        .select(`
          id,
          name,
          description,
          file_path,
          file_type,
          preview_image,
          price,
          tags,
          downloads,
          view_count,
          printability_score,
          created_at,
          user_id,
          status,
          is_published
        `);
        // Temporarily removed published filter to debug
        // .eq('status', 'published')
        // .eq('is_published', true);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('downloads', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data: modelsData, error: modelsError } = await query.limit(20);

      if (modelsError) {
        console.error('Error fetching models:', modelsError);
        toast({
          title: "Error loading models",
          description: "Could not load models from the database",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched models:', modelsData?.length, 'models');
      console.log('First model sample:', modelsData?.[0]);

      // Fetch profiles separately for each model
      const modelsWithProfiles: Model[] = [];
      
      for (const model of modelsData || []) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, email, avatar_url')
          .eq('id', model.user_id)
          .single();

        modelsWithProfiles.push({
          ...model,
          profiles: profileData || null
        });
      }

      setModels(modelsWithProfiles);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelClick = (modelId: string) => {
    navigate(`/model/${modelId}`);
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage.from('3d-models').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    const { data } = supabase.storage.from('model-images').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           model.tags?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container py-8 flex-grow pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container py-8 flex-grow pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover 3D Models</h1>
          <p className="text-muted-foreground mb-6">
            Explore high-quality CAD models created by our community of designers
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="gear">Gear</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Downloaded</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No models found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new uploads.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => handleModelClick(model.id)}>
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Model3DThumbnail
                      modelId={model.id}
                      filePath={model.file_path}
                      className="w-full h-full"
                    />
                    
                    {/* Price Badge */}
                    {model.price && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        ₹{model.price}
                      </Badge>
                    )}
                    
                    {/* Printability Score */}
                    {model.printability_score && (
                      <Badge variant="secondary" className="absolute top-3 left-3">
                        {model.printability_score}% Printable
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {model.name}
                    </h3>
                    
                    {model.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {model.description}
                      </p>
                    )}
                    
                    {/* Creator Info */}
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                        {model.profiles?.username ? model.profiles.username[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        by {model.profiles?.username || 'Unknown'}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    {model.tags && model.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {model.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {model.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{model.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {model.downloads || 0}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {model.view_count || 0}
                      </div>
                      <div className="text-xs">
                        {new Date(model.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
