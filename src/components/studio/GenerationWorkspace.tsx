import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wand2, 
  Download, 
  Eye, 
  RefreshCw, 
  Settings, 
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface GenerationJob {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  createdAt: string;
  estimatedTime?: number;
}

export const GenerationWorkspace = () => {
  const [jobs] = useState<GenerationJob[]>([
    {
      id: "1",
      prompt: "A futuristic robot with LED lights and metallic finish",
      status: "completed",
      progress: 100,
      resultUrl: "/api/models/robot-001.obj",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2", 
      prompt: "Modern architectural building with glass facade",
      status: "processing",
      progress: 65,
      createdAt: "2024-01-15T11:00:00Z",
      estimatedTime: 3
    },
    {
      id: "3",
      prompt: "Organic flowing sculpture inspired by nature",
      status: "pending",
      progress: 0,
      createdAt: "2024-01-15T11:15:00Z",
      estimatedTime: 5
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Generation Queue */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Generations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Generation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(job.status)}
                              <Badge className={getStatusColor(job.status)}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </Badge>
                              {job.estimatedTime && job.status !== 'completed' && (
                                <span className="text-xs text-muted-foreground">
                                  ~{job.estimatedTime}min remaining
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              {job.prompt}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Started: {new Date(job.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            {job.status === 'completed' && (
                              <>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {job.status === 'processing' && (
                          <div className="space-y-2">
                            <Progress value={job.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Generating mesh...</span>
                              <span>{job.progress}%</span>
                            </div>
                          </div>
                        )}
                        
                        {job.status === 'completed' && (
                          <div className="mt-3 p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">Model ready for preview</span>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View 3D
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Controls */}
        <div className="space-y-6">
          {/* Generation Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Generation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Queue Position</span>
                <Badge variant="outline">3rd</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Time</span>
                <span className="text-sm font-medium">4.2min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-green-500">96%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Priority Generation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Batch Process
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Generation Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-muted">
                    <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};