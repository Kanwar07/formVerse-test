import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  Eye, 
  Download, 
  Edit, 
  MoreHorizontal, 
  FileText,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Settings,
  Lock,
  Unlock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Model {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  price: number;
  downloads: number;
  view_count: number;
  status: string;
  created_at: string;
  printability_score: number;
  tags: string[];
}

const CreatorDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalModels: 0,
    totalDownloads: 0,
    totalViews: 0,
    totalEarnings: 0
  });

  // Check if user can access this dashboard
  const canEdit = user?.id === id;

  useEffect(() => {
    if (id) {
      fetchCreatorModels();
    }
  }, [id]);

  const fetchCreatorModels = async () => {
    try {
      setLoading(true);
      
      // Fetch models for this creator
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (modelsError) {
        console.error('Error fetching models:', modelsError);
        toast({
          title: "Error",
          description: "Failed to load models",
          variant: "destructive"
        });
        return;
      }

      setModels(modelsData || []);
      
      // Calculate stats
      const totalModels = modelsData?.length || 0;
      const totalDownloads = modelsData?.reduce((sum, model) => sum + (model.downloads || 0), 0) || 0;
      const totalViews = modelsData?.reduce((sum, model) => sum + (model.view_count || 0), 0) || 0;
      const totalEarnings = modelsData?.reduce((sum, model) => sum + ((model.price || 0) * (model.downloads || 0)), 0) || 0;

      setStats({
        totalModels,
        totalDownloads,
        totalViews,
        totalEarnings
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load creator data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelStatusChange = async (modelId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const { error } = await supabase
        .from('models')
        .update({ status: newStatus })
        .eq('id', modelId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update model status",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `Model ${newStatus} successfully`,
      });

      // Refresh models
      fetchCreatorModels();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {canEdit ? "My Models" : "Creator Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {canEdit ? "Manage your uploaded 3D models" : "View creator's models and stats"}
            </p>
          </div>
          
          {canEdit && (
            <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New Model
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalModels}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Models Section */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {models.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No models uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  {canEdit ? "Start by uploading your first 3D model" : "This creator hasn't uploaded any models yet"}
                </p>
                {canEdit && (
                  <Button onClick={() => navigate('/upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Model
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                  <Card key={model.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={model.preview_image || '/placeholder.svg'}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(model.status)}>
                          {model.status === 'published' && <Unlock className="h-3 w-3 mr-1" />}
                          {model.status === 'draft' && <Lock className="h-3 w-3 mr-1" />}
                          {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg truncate">{model.name}</h3>
                        {canEdit && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/model/${model.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {model.status === 'draft' && (
                                <DropdownMenuItem 
                                  onClick={() => handleModelStatusChange(model.id, 'published')}
                                >
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {model.status === 'published' && (
                                <DropdownMenuItem 
                                  onClick={() => handleModelStatusChange(model.id, 'draft')}
                                >
                                  <Lock className="h-4 w-4 mr-2" />
                                  Make Draft
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {model.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {model.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {model.downloads || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {model.printability_score || 0}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          {formatPrice(model.price || 0)}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/model/${model.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Filter by status */}
          {['published', 'draft', 'archived'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models
                  .filter((model) => model.status === status)
                  .map((model) => (
                    <Card key={model.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={model.preview_image || '/placeholder.svg'}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg truncate">{model.name}</h3>
                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/model/${model.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {model.status === 'draft' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleModelStatusChange(model.id, 'published')}
                                  >
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                {model.status === 'published' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleModelStatusChange(model.id, 'draft')}
                                  >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Make Draft
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {model.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {model.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {model.downloads || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {model.printability_score || 0}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">
                            {formatPrice(model.price || 0)}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/model/${model.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              {models.filter((model) => model.status === status).length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {status} models</h3>
                  <p className="text-muted-foreground">
                    No models with {status} status found.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;