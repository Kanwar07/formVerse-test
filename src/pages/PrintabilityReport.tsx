
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Download,
  Info,
  Settings
} from "lucide-react";

const PrintabilityReport = () => {
  const { modelId } = useParams();
  
  // Mock data for the report
  const modelData = {
    id: modelId,
    name: "Industrial Gear Assembly",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3",
    overall: 92,
    geometry: 96,
    topology: 88,
    printability: 94,
    issues: [
      { 
        id: 1, 
        type: "warning", 
        message: "Thin walls detected in 3 areas", 
        details: "Some areas have wall thickness below recommended 2mm",
        position: { x: 45, y: 23, z: 78 }
      },
      { 
        id: 2, 
        type: "info", 
        message: "Non-manifold edges detected", 
        details: "Minor non-manifold edges at connection points",
        position: { x: 12, y: 56, z: 34 }
      },
      { 
        id: 3, 
        type: "success", 
        message: "No overhangs above 45°", 
        details: "Model is suitable for printing without supports",
        position: null
      }
    ],
    materials: [
      { name: "PLA", compatibility: "High", score: 95 },
      { name: "ABS", compatibility: "Medium", score: 78 },
      { name: "PETG", compatibility: "High", score: 90 },
      { name: "Nylon", compatibility: "Low", score: 45 },
      { name: "TPU", compatibility: "Medium", score: 72 }
    ]
  };

  // Function to get the color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  // Function to get the badge variant based on issue type
  const getIssueVariant = (type: string) => {
    switch (type) {
      case "warning": 
        return "outline";
      case "info": 
        return "secondary";
      case "success": 
        return "default";
      default:
        return "outline";
    }
  };
  
  // Function to get the icon based on issue type
  const getIssueIcon = (type: string) => {
    switch (type) {
      case "warning": 
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "info": 
        return <Info className="h-4 w-4 text-blue-600" />;
      case "success": 
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Printability Report</h1>
            <p className="text-muted-foreground">Comprehensive analysis by FormIQ AI</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Preview Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>3D Model Preview</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    View Options
                  </Button>
                </CardTitle>
                <CardDescription>
                  {modelData.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted/50 rounded-md h-[400px] flex items-center justify-center overflow-hidden">
                  <img 
                    src={modelData.thumbnail} 
                    alt={modelData.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Interactive 3D preview would be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="issues">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="issues" className="space-y-4 pt-4">
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="font-medium mb-4">Detected Issues</h3>
                  <div className="space-y-3">
                    {modelData.issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="flex items-start p-3 rounded-md bg-muted/50"
                      >
                        <div className="mr-3 mt-1">
                          {getIssueIcon(issue.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{issue.message}</h4>
                            <Badge variant={getIssueVariant(issue.type)}>
                              {issue.type === "warning" ? "Warning" : 
                               issue.type === "info" ? "Info" : "Success"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                          {issue.position && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Position: X: {issue.position.x}, Y: {issue.position.y}, Z: {issue.position.z}
                              <Button variant="link" size="sm" className="h-auto p-0 ml-2">
                                View in model
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Geometry Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Surface Quality</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(94)}`}>94/100</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Wall Thickness</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(88)}`}>88/100</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Water-tightness</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(98)}`}>98/100</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Topology Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Support Needs</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(92)}`}>92/100</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overhangs</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(85)}`}>85/100</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Complexity</span>
                          <span className={`text-sm font-medium ${getScoreColorClass(76)}`}>76/100</span>
                        </div>
                        <Progress value={76} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Poly Count</p>
                        <p className="font-medium">42,876</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vertices</p>
                        <p className="font-medium">21,438</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dimensions</p>
                        <p className="font-medium">120 x 85 x 45mm</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Volume</p>
                        <p className="font-medium">459cm³</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="materials" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modelData.materials.map((material, index) => (
                    <Card key={index} className={material.compatibility === 'High' ? 'border-primary/50' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{material.name}</h4>
                          <Badge variant={
                            material.compatibility === 'High' ? 'default' : 
                            material.compatibility === 'Medium' ? 'outline' : 
                            'secondary'
                          }>
                            {material.compatibility}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={material.score} className="h-2" />
                          <span className={`text-sm font-medium ${getScoreColorClass(material.score)}`}>
                            {material.score}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Material Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      FormIQ AI has analyzed your model's structural properties and thermal characteristics to 
                      determine optimal material compatibility. PLA and PETG are highly recommended due to the 
                      model's thin walls and precise gear teeth. For functional prototyping, ABS would work but 
                      may require additional supports due to potential warping.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI Recommendations</CardTitle>
                    <CardDescription>
                      Suggested improvements generated by FormIQ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-md bg-muted/50">
                      <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Increase wall thickness</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Identified areas with walls below 2mm thickness could benefit from reinforcement 
                          to improve durability, especially for functional parts.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md bg-muted/50">
                      <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Fix non-manifold edges</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Repair non-manifold edges detected at connection points to ensure proper slicing 
                          and prevent potential printing failures.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md bg-muted/50">
                      <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Consider alternate orientation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Rotating the model 45° around the Y-axis could reduce overhang concerns 
                          and improve surface finish on critical gear tooth faces.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-4">
                  <svg className="w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="351.86"
                      strokeDashoffset={(351.86 * (100 - modelData.overall)) / 100}
                      className="text-primary"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <span className="absolute text-4xl font-bold">{modelData.overall}</span>
                </div>
                <p className="text-center text-muted-foreground text-sm mb-4">
                  Your model has excellent printability. With minor adjustments, it will be production-ready.
                </p>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Geometry</p>
                    <p className={`text-sm font-medium ${getScoreColorClass(modelData.geometry)}`}>{modelData.geometry}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Topology</p>
                    <p className={`text-sm font-medium ${getScoreColorClass(modelData.topology)}`}>{modelData.topology}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Printability</p>
                    <p className={`text-sm font-medium ${getScoreColorClass(modelData.printability)}`}>{modelData.printability}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This model falls in the top 15% of industrial components on FormVerse for printability. 
                  Its geometry is well-optimized for additive manufacturing with minimal support requirements.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Water-tight mesh with clean topology</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span>Optimized for FDM printing</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    <span>Minor thin wall areas detected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Run Advanced Analysis
                </Button>
                <Button variant="secondary" className="w-full justify-between group">
                  Fix Issues Automatically
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PrintabilityReport;
