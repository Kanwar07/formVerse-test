
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormIQInsight } from "@/components/formiq/FormIQInsight";
import { FormIQFeatureCard } from "@/components/formiq/FormIQFeatureCard";
import { Brain, ChevronLeft, FileCheck, FileX, Info, Printer, Settings, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PrintabilityReport = () => {
  const { modelId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample data - in a real app, this would come from API
  const printabilityScore = 92;
  const materialRecommendations = [
    "PLA - Good for detailed features", 
    "PETG - Better durability", 
    "ABS - Heat resistant option"
  ];
  const printingTechniques = [
    "FDM - Standard printing", 
    "SLA - For high precision", 
    "SLS - For complex geometry"
  ];
  const designIssues = [
    { issue: "Thin walls in section A-2", severity: "Medium", details: "Wall thickness is 0.8mm, recommended minimum is 1.2mm" },
    { issue: "Sharp interior corners", severity: "Low", details: "Consider using fillets with minimum radius of 0.5mm" },
    { issue: "Unsupported overhangs", severity: "High", details: "45° overhangs detected in lower section" }
  ];
  const oemCompatibility = [
    { name: "Prusa", score: 95, models: ["i3 MK3S+", "Mini+"] },
    { name: "Creality", score: 88, models: ["Ender 3", "CR-10"] },
    { name: "Ultimaker", score: 92, models: ["S5", "S3"] },
    { name: "Anycubic", score: 86, models: ["Photon Mono", "Vyper"] }
  ];
  const marketInsights = [
    { metric: "Download Trend", value: "Rising (+12% month over month)" },
    { metric: "Similar Models", value: "14 found in marketplace" },
    { metric: "Top Category", value: "Industrial Components" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 pt-24">
      <Navbar />
      
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <Link to="/upload" className="text-muted-foreground hover:text-foreground flex items-center mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Upload
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mb-1">Printability Report</h1>
                <div className="ml-3 px-2 py-1 rounded-md bg-gradient-to-r from-[hsl(var(--formiq-blue)/10)] to-[hsl(var(--formiq-purple)/10)] flex items-center">
                  <Brain className="h-4 w-4 text-primary mr-1" />
                  <span className="text-xs font-medium formiq-gradient-text">FormIQ Enhanced</span>
                </div>
              </div>
              <p className="text-muted-foreground">AI-generated analysis and recommendations for model #{modelId}</p>
            </div>
            
            <div className="flex items-center">
              <Button variant="outline" className="mr-2">Download Report</Button>
              <Button>Share</Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Model Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
                        alt="Model Preview" 
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                    <Button variant="outline" className="w-full">View 3D Preview</Button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Industrial Gear Assembly</h3>
                    <div className="text-muted-foreground mb-4">Model #{modelId}</div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">Printability Score</div>
                          <div className="text-sm font-medium">{printabilityScore}/100</div>
                        </div>
                        <Progress 
                          value={printabilityScore} 
                          className="h-2"
                          indicatorClassName={`${printabilityScore >= 90 ? 'bg-emerald-500' : printabilityScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">Poor</span>
                          <span className="text-xs text-muted-foreground">Excellent</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">File Type</p>
                          <p>STL</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p>24.3 MB</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dimensions</p>
                          <p>120mm × 85mm × 45mm</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Poly Count</p>
                          <p>214,532</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground text-sm">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">industrial</Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">gear</Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">mechanical</Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">engineering</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Printability Overview</TabsTrigger>
                <TabsTrigger value="issues">Design Issues</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">FormIQ Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        This model has been analyzed by FormIQ for printability across multiple manufacturing methods and printers.
                        The model scores highly overall with some specific areas for improvement noted below.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/30">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Star className="h-4 w-4 mr-2 text-amber-500" />
                            Key Strengths
                          </h4>
                          <ul className="text-sm space-y-1 ml-6 list-disc">
                            <li>Well-structured mesh topology</li>
                            <li>Good overall wall thickness</li>
                            <li>Efficient poly count for detail level</li>
                            <li>Clear feature separation</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-muted/30">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <FileX className="h-4 w-4 mr-2 text-red-500" />
                            Areas for Improvement
                          </h4>
                          <ul className="text-sm space-y-1 ml-6 list-disc">
                            <li>Thin walls in section A-2</li>
                            <li>Unsupported overhangs in lower section</li>
                            <li>Sharp interior corners could cause stress</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {oemCompatibility.slice(0, 3).map((oem, index) => (
                          <div key={index} className="p-4 rounded-lg border">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{oem.name}</h4>
                              <Badge variant={oem.score >= 90 ? "outline" : "secondary"} className={oem.score >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}>
                                {oem.score}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Compatible with:</p>
                            <div className="text-xs">
                              {oem.models.map((model, i) => (
                                <span key={i} className="inline-block mr-2 mb-1 bg-muted rounded-full px-2 py-0.5">{model}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormIQInsight
                    title="Market Insights"
                    content="This design shows strong potential in the engineering and industrial markets."
                    icon={<Info className="h-4 w-4 text-primary" />}
                    metrics={marketInsights.map(insight => ({
                      label: insight.metric,
                      value: insight.value
                    }))}
                  />
                  
                  <FormIQInsight
                    title="Print Settings Recommendation"
                    content="Optimal print settings have been generated for this model."
                    icon={<Settings className="h-4 w-4 text-primary" />}
                    metrics={[
                      { label: "Layer Height", value: "0.12mm" },
                      { label: "Infill", value: "20% Gyroid" },
                      { label: "Support", value: "Tree style, 5° overhang" }
                    ]}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="issues" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Design Issues ({designIssues.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {designIssues.map((issue, index) => (
                        <div key={index} className="p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium flex items-center">
                              <FileX className={`h-4 w-4 mr-2 ${issue.severity === "High" ? "text-red-500" : issue.severity === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                              {issue.issue}
                            </h4>
                            <Badge variant={issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "default" : "outline"}>
                              {issue.severity} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.details}</p>
                          <div className="mt-4 p-3 bg-muted/30 rounded text-sm">
                            <p className="font-medium mb-1">FormIQ Fix Recommendation:</p>
                            {issue.severity === "High" && (
                              <p>Increase wall thickness to at least 1.2mm in the affected area. Consider adding supporting structures to overhangs exceeding 45°.</p>
                            )}
                            {issue.severity === "Medium" && (
                              <p>Increase wall thickness to the recommended minimum or adjust print settings for higher precision in thin-walled sections.</p>
                            )}
                            {issue.severity === "Low" && (
                              <p>Add fillets to sharp interior corners with a minimum radius of 0.5mm to reduce stress concentration.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Material Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {materialRecommendations.map((material, index) => {
                        const [name, description] = material.split(" - ");
                        return (
                          <div key={index} className="p-4 rounded-lg border">
                            <h4 className="font-medium mb-1">{name}</h4>
                            <p className="text-sm text-muted-foreground">{description}</p>
                            <div className="flex items-center mt-3">
                              <div className="flex space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < (index === 0 ? 5 : index === 1 ? 4 : 3) ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs ml-2 text-muted-foreground">
                                {index === 0 ? "Excellent" : index === 1 ? "Good" : "Adequate"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-4">Printing Techniques</h4>
                      <div className="space-y-4">
                        {printingTechniques.map((technique, index) => {
                          const [name, description] = technique.split(" - ");
                          return (
                            <div key={index} className="p-4 rounded-lg border flex justify-between items-center">
                              <div>
                                <h5 className="font-medium">{name}</h5>
                                <p className="text-sm text-muted-foreground">{description}</p>
                              </div>
                              <div>
                                <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-primary" : ""}>
                                  {index === 0 ? "Recommended" : "Alternative"}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-4">Print Settings Optimization</h4>
                      <div className="p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Layer Settings</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Layer Height:</span>
                                <span>0.12mm</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">First Layer:</span>
                                <span>0.2mm</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Line Width:</span>
                                <span>0.4mm</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Infill</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Density:</span>
                                <span>20%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Pattern:</span>
                                <span>Gyroid</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Overlap:</span>
                                <span>15%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Support</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span>Tree</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Density:</span>
                                <span>10%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Overhang:</span>
                                <span>5°</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 text-primary mr-2" />
                    FormIQ Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Overall Score</span>
                        <span className={`text-lg font-bold ${printabilityScore >= 90 ? 'text-emerald-500' : printabilityScore >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                          {printabilityScore}/100
                        </span>
                      </div>
                      <Progress 
                        value={printabilityScore} 
                        className="h-2"
                        indicatorClassName={`${printabilityScore >= 90 ? 'bg-emerald-500' : printabilityScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded bg-muted/30 text-center">
                          <div className="text-xs text-muted-foreground">Geometry</div>
                          <div className="font-medium">{printabilityScore - 3}%</div>
                        </div>
                        <div className="p-2 rounded bg-muted/30 text-center">
                          <div className="text-xs text-muted-foreground">Printability</div>
                          <div className="font-medium">{printabilityScore - 8}%</div>
                        </div>
                        <div className="p-2 rounded bg-muted/30 text-center">
                          <div className="text-xs text-muted-foreground">Material Usage</div>
                          <div className="font-medium">{printabilityScore + 3}%</div>
                        </div>
                        <div className="p-2 rounded bg-muted/30 text-center">
                          <div className="text-xs text-muted-foreground">Market Fit</div>
                          <div className="font-medium">{printabilityScore + 5}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Issues Detected</h4>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">High Priority</div>
                        <Badge variant="destructive">{designIssues.filter(i => i.severity === "High").length}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm">Medium Priority</div>
                        <Badge variant="default">{designIssues.filter(i => i.severity === "Medium").length}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm">Low Priority</div>
                        <Badge variant="outline">{designIssues.filter(i => i.severity === "Low").length}</Badge>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full" variant="outline" asChild>
                        <Link to={`/model/${modelId}/history`}>View Model History</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <FormIQFeatureCard
                title="Auto-Fix Issues"
                description="Let FormIQ automatically repair common issues with your model."
                icon={<FileCheck className="h-5 w-5" />}
                actionLabel="Run Auto-Fix"
                onAction={() => {}}
                beta={true}
              />
              
              <FormIQFeatureCard
                title="Generate Slicing Profile"
                description="Export optimized slicing profiles for popular software."
                icon={<Printer className="h-5 w-5" />}
                actionLabel="Generate Profile"
                onAction={() => {}}
              />
              
              <FormIQFeatureCard
                title="Market Analysis"
                description="Get insights on market demand and pricing for similar models."
                icon={<Info className="h-5 w-5" />}
                actionLabel="View Analysis"
                onAction={() => {}}
              />
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

export default PrintabilityReport;
