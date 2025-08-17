
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FormIQInsight } from "@/components/formiq/FormIQInsight";
import { ModelsPagination } from "@/components/dashboard/ModelsPagination";
import { ModelFilters } from "@/components/dashboard/ModelFilters";
import { useUserModels } from "@/hooks/useUserModels";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { EditModelModal } from "@/components/dashboard/EditModelModal";
import { 
  ArrowRight, 
  Brain, 
  Clock, 
  Download, 
  File, 
  FileImage, 
  Tag,
  DollarSign,
  Check,
  TrendingUp,
  Upload, 
  Users,
  BadgeCheck,
  Loader2,
  Trash2,
  MoreHorizontal,
  Edit
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("models");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [filters, setFilters] = useState({ status: 'all' as const, category: undefined as string | undefined });
  const [sort, setSort] = useState({ field: 'created_at' as const, direction: 'desc' as const });
  const { user } = useAuth();
  const { models, stats, loading, error, hasMore, updating, updateModelPublishStatus, updateModel, deleteModel, refetch } = useUserModels(currentPage, 12, filters, sort);

  // Debounced toggle handler
  const handleTogglePublish = useCallback((modelId: string, isPublished: boolean) => {
    updateModelPublishStatus(modelId, isPublished);
  }, [updateModelPublishStatus]);

  const getStatusBadgeProps = (model: any) => {
    if (model.quality_status === 'rejected' || model.admin_status === 'rejected') {
      return { variant: "destructive" as const, text: "Needs Revision" };
    }
    if (model.quality_status === 'pending' || model.admin_status === 'pending') {
      return { variant: "outline" as const, text: "Pending Review" };
    }
    if (model.is_published) {
      return { variant: "default" as const, text: "Published" };
    }
    return { variant: "secondary" as const, text: "Draft" };
  };

  const calculateRevenue = (model: any) => {
    return (model.price || 0) * (model.downloads || 0);
  };

  const handleModelUpdated = (updatedModel: any) => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', category: undefined });
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: any) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h2>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <Toaster />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Creator Dashboard</h1>
            <p className="text-muted-foreground">Manage your models, track performance, and get AI insights.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to="/pricing">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Link>
            </Button>
            <Button className="mt-2 md:mt-0" asChild>
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Model
              </Link>
            </Button>
          </div>
        </div>

        {/* Current Plan Banner */}
        <Card className="mb-8 bg-gradient-to-r from-[hsl(var(--primary)/5)] to-[hsl(var(--accent)/5)]">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Free Creator Plan</h3>
                <p className="text-sm text-muted-foreground">5/5 models uploaded • Basic FormIQ features</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm">View Usage</Button>
              <Button size="sm" asChild>
                <Link to="/pricing">
                  Upgrade to Pro
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FormIQ Status Banner */}
        <Card className="mb-8 bg-gradient-to-r from-[hsl(var(--formiq-blue)/10)] to-[hsl(var(--formiq-purple)/10)]">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">FormIQ is enhancing your models</h3>
                <p className="text-sm text-muted-foreground">AI-optimized tags, pricing, and printability analysis</p>
              </div>
            </div>
            <Button variant="default" size="sm" className="mt-4 md:mt-0" asChild>
              <Link to="/formiq">
                View FormIQ Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Models</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.totalModels}</p>
              </div>
              <FileImage className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Downloads</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="text-2xl font-bold">{loading ? "..." : `$${stats.totalRevenue.toFixed(2)}`}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Unique Buyers</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.uniqueBuyers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/40" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="models" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="models">My Models</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-semibold">Your Models</h2>
              <ModelFilters
                filters={filters}
                sort={sort}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Loading your models...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {models.map((model) => {
                  const statusProps = getStatusBadgeProps(model);
                  const revenue = calculateRevenue(model);
                  const isUpdating = updating === model.id;
                  
                  return (
                    <Card key={model.id} className="overflow-hidden relative">
                      {!model.is_published && (
                        <div className="absolute inset-0 bg-muted/50 pointer-events-none flex items-center justify-center">
                          <Badge variant="outline" className="bg-background/90 pointer-events-auto">
                            Hidden from marketplace
                          </Badge>
                        </div>
                      )}
                      
                      <div className="aspect-video w-full relative">
                        <img 
                          src={model.preview_image || "/placeholder.svg"} 
                          alt={model.name} 
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant={statusProps.variant}>
                            {statusProps.text}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
                          <div className="flex items-center gap-1 bg-background/90 rounded-md px-2 py-1">
                            <span className="text-xs font-medium">
                              {model.is_published ? "Published" : "Unpublished"}
                            </span>
                            <Switch
                              checked={model.is_published}
                              onCheckedChange={(checked) => handleTogglePublish(model.id, checked)}
                              disabled={isUpdating}
                              className="scale-75"
                            />
                            {isUpdating && (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>
                          Printability Score: {model.printability_score || 0}/100
                        </CardDescription>
                        <Progress value={model.printability_score || 0} className="h-2" />
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Downloads</p>
                            <p className="text-sm font-medium">{model.downloads}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="text-sm font-medium">${revenue.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Category</p>
                          <p className="text-sm font-medium">{model.category || "Uncategorized"}</p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingModel(model)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Model</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{model.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteModel(model.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}

                {/* Upload Card */}
                <Card className="border-dashed flex flex-col items-center justify-center text-center p-6 h-full">
                  <Upload className="h-12 w-12 text-muted-foreground/60 mb-4" />
                  <h3 className="font-medium mb-2">Upload New Model</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop or click to upload STL, OBJ, or STEP files
                  </p>
                  <Button asChild>
                    <Link to="/upload">
                      Upload Model
                    </Link>
                  </Button>
                </Card>
              </div>
            )}

            {models.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Upload className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">No models yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first 3D model to get started
                </p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Model</Link>
                </Button>
              </div>
            )}

            {/* Pagination */}
            {models.length > 0 && (
              <ModelsPagination 
                currentPage={currentPage}
                hasMore={hasMore}
                onPageChange={setCurrentPage}
                loading={loading}
              />
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View detailed performance metrics for your models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Charts and analytics will be displayed here.</p>
                  <Button variant="outline" className="mt-4">Generate Full Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track earnings and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Payment history will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-muted-foreground">Account settings will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Recommendations */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                </div>
                FormIQ AI Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your model performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormIQInsight 
                  title="Printability Enhancement"
                  content="Increasing the polygon count in 'Industrial Gear Assembly' could improve printability score by up to 12%."
                  icon={<Check className="h-4 w-4 text-primary" />}
                />
                
                <FormIQInsight 
                  title="Pricing Optimization"
                  content="Consider adjusting your pricing strategy. Models similar to yours are priced 15% higher on average."
                  icon={<DollarSign className="h-4 w-4 text-primary" />}
                />
                
                <FormIQInsight 
                  title="Tag Recommendations"
                  content="Adding 'aerospace' and 'precision' to your model tags could increase discoverability by 32%."
                  icon={<Tag className="h-4 w-4 text-primary" />}
                />
                
                <FormIQInsight 
                  title="Market Opportunity"
                  content="High demand detected for modular components in the manufacturing sector. Consider creating related models."
                  icon={<TrendingUp className="h-4 w-4 text-primary" />}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/formiq">
                  View All FormIQ Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <EditModelModal
        model={editingModel}
        isOpen={!!editingModel}
        onClose={() => setEditingModel(null)}
        onModelUpdated={handleModelUpdated}
      />

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
