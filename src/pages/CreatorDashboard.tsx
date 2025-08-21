import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OptimizedModelCard } from "@/components/dashboard/OptimizedModelCard";
import { 
  Upload, 
  FileText,
  DollarSign,
  Eye, 
  Download
} from "lucide-react";

interface Model {
  id: string;
  name: string;
  description: string;
  preview_image: string | null;
  price: number;
  downloads: number;
  view_count: number;
  status: string;
  quality_status: string;
  is_published: boolean;
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
    if (id && id !== ':id') {
      fetchCreatorModels();
    } else {
      console.error('Invalid creator ID:', id);
      setLoading(false);
    }
  }, [id]);

  const fetchCreatorModels = async () => {
    try {
      setLoading(true);
      
      // Fetch models for this creator with all necessary fields
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select(`
          id,
          name,
          description,
          preview_image,
          price,
          downloads,
          view_count,
          status,
          quality_status,
          is_published,
          created_at,
          printability_score,
          tags
        `)
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
        .update({ 
          status: newStatus,
          is_published: newStatus === 'published'
        })
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

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', modelId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete model",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Model deleted successfully",
      });

      // Refresh models
      fetchCreatorModels();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete model",
        variant: "destructive"
      });
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
    <div className="min-h-screen bg-muted/30 pt-24">
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
    <div className="min-h-screen bg-muted/30 pt-24">
      <Navbar />
      
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your uploaded 3D models and track performance
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {models.map((model) => (
                  <OptimizedModelCard
                    key={model.id}
                    model={model}
                    onEdit={canEdit ? (modelId) => navigate(`/edit-model/${modelId}`) : undefined}
                    onDelete={canEdit ? handleDeleteModel : undefined}
                    onTogglePublish={canEdit ? (modelId, isPublished) => 
                      handleModelStatusChange(modelId, isPublished ? 'published' : 'draft') : undefined
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Filter by status */}
          {['published', 'draft', 'archived'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {models
                  .filter((model) => model.status === status)
                  .map((model) => (
                    <OptimizedModelCard
                      key={model.id}
                      model={model}
                      onEdit={canEdit ? (modelId) => navigate(`/edit-model/${modelId}`) : undefined}
                      onDelete={canEdit ? handleDeleteModel : undefined}
                      onTogglePublish={canEdit ? (modelId, isPublished) => 
                        handleModelStatusChange(modelId, isPublished ? 'published' : 'draft') : undefined
                      }
                    />
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