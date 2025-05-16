
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Download, Eye, FileText, GitBranch, History } from "lucide-react";

const VersionHistory = () => {
  const { modelId } = useParams();

  // Mock data for versions
  const modelVersions = [
    {
      id: "v4.0",
      date: "2023-05-12",
      author: "MechDesigns",
      changes: [
        "Improved gear teeth geometry for better mesh",
        "Reduced weight by 12% while maintaining structural integrity",
        "Fixed wall thickness issues flagged by FormIQ"
      ],
      printabilityScore: 95,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3"
    },
    {
      id: "v3.2",
      date: "2023-04-03",
      author: "MechDesigns",
      changes: [
        "Added reinforcement to mounting points",
        "Fixed non-manifold edges at junction points"
      ],
      printabilityScore: 87,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3"
    },
    {
      id: "v3.1",
      date: "2023-03-21",
      author: "MechDesigns",
      changes: [
        "Minor dimensional adjustments for tolerance",
        "Improved thread profile for standard fasteners"
      ],
      printabilityScore: 85,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3"
    },
    {
      id: "v3.0",
      date: "2023-02-15",
      author: "MechDesigns",
      changes: [
        "Redesigned mounting interface for compatibility with Series B housings",
        "Optimized for FDM printing with reduced support requirements",
        "Added labels for assembly orientation"
      ],
      printabilityScore: 79,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1226&ixlib=rb-4.0.3"
    }
  ];

  // Mock data for remixes
  const modelRemixes = [
    {
      id: "remix-1",
      name: "Industrial Gear Assembly - High Temp",
      creator: "ThermalCAD",
      date: "2023-04-15",
      description: "Optimized for high-temperature environments with enhanced thermal resistance",
      thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3"
    },
    {
      id: "remix-2",
      name: "Industrial Gear Assembly - Lightweight",
      creator: "AeroDesign",
      date: "2023-03-05",
      description: "Reduced weight version with honeycomb internal structure for aerospace applications",
      thumbnailUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
    }
  ];

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
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
            <div className="flex items-center mb-1">
              <h1 className="text-3xl font-bold mr-2">Version History</h1>
              <Badge variant="outline" className="font-normal">
                Industrial Gear Assembly
              </Badge>
            </div>
            <p className="text-muted-foreground">Track model evolution and derivative works</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Version Column */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Version (v4.0)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full relative rounded-md overflow-hidden mb-4">
                  <img 
                    src={modelVersions[0].thumbnailUrl} 
                    alt="Current Version" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Printability Score</span>
                    <span className="text-sm font-medium">{modelVersions[0].printabilityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{formatDate(modelVersions[0].date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Author</span>
                    <span className="text-sm">{modelVersions[0].author}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    View Model
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Files
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Printability Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Version History Column */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-4 w-4" />
                  Version Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-5 w-px bg-muted-foreground/20"></div>
                  
                  <div className="space-y-8">
                    {modelVersions.map((version, index) => (
                      <div key={version.id} className="relative pl-12">
                        <div className={`absolute left-0 top-1 h-10 w-10 rounded-full flex items-center justify-center z-10 ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {version.id}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between mb-2">
                          <div className="flex items-center">
                            <h3 className="font-medium">{index === 0 ? 'Current Version' : `Previous Version`}</h3>
                            <Badge variant="outline" className="ml-2">
                              Score: {version.printabilityScore}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center mt-1 sm:mt-0">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <time className="text-sm text-muted-foreground">{formatDate(version.date)}</time>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-md p-3 space-y-1">
                          {version.changes.map((change, changeIndex) => (
                            <p key={changeIndex} className="text-sm">• {change}</p>
                          ))}
                        </div>
                        
                        <div className="flex justify-end mt-2 space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                          {index > 0 && (
                            <Button variant="ghost" size="sm">
                              Compare with current
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Remixes Section */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <GitBranch className="h-4 w-4 mr-2" />
                <h2 className="text-xl font-bold">Remixes & Derivatives</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modelRemixes.map((remix) => (
                  <Card key={remix.id}>
                    <div className="aspect-video w-full relative">
                      <img 
                        src={remix.thumbnailUrl} 
                        alt={remix.name} 
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-1">{remix.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {remix.creator} • {formatDate(remix.date)}
                      </p>
                      <p className="text-sm mb-3">{remix.description}</p>
                      <Button size="sm" className="w-full" variant="outline">View Remix</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 bg-muted/50 border rounded-md p-6 text-center">
                <h3 className="font-medium mb-2">Create Your Own Remix</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  License this model to create your own customized version while 
                  maintaining attribution to the original creator.
                </p>
                <Button>Start a Remix</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default VersionHistory;
