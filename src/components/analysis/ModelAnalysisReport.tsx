import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CadQuaPricing } from "@/components/printing/CadQuaPricing";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Download,
  Eye,
  Layers,
  Box,
  Ruler,
  Zap,
  ArrowRight
} from "lucide-react";

interface AnalysisData {
  printabilityScore: number;
  geometryAnalysis: {
    vertices: number;
    faces: number;
    volume: number;
    surfaceArea: number;
    boundingBox: { x: number; y: number; z: number };
  };
  issues: Array<{
    type: 'critical' | 'warning' | 'info';
    category: string;
    description: string;
    severity: number;
    fixSuggestion?: string;
  }>;
  materialRecommendations: Array<{
    material: string;
    compatibility: number;
    properties: string[];
    costEstimate: string;
  }>;
  printingTechniques: Array<{
    technique: string;
    suitability: number;
    requirements: string[];
    timeEstimate: string;
  }>;
  qualityMetrics: {
    manifold: boolean;
    watertight: boolean;
    supportRequired: boolean;
    printTime: string;
    materialUsage: string;
  };
}

interface ModelAnalysisReportProps {
  modelId: string;
  modelName: string;
  fileUrl: string;
  onPurchase: () => void;
  onAnalysisComplete?: (canPrint: boolean) => void;
}

export const ModelAnalysisReport = ({ 
  modelId, 
  modelName, 
  fileUrl, 
  onPurchase,
  onAnalysisComplete
}: ModelAnalysisReportProps) => {
  const [currentStep, setCurrentStep] = useState<'analysis' | 'errors' | 'pricing'>('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock analysis data - in real app, this would come from FormIQ
  const analysisData: AnalysisData = {
    printabilityScore: 87,
    geometryAnalysis: {
      vertices: 24567,
      faces: 49134,
      volume: 125.6,
      surfaceArea: 892.3,
      boundingBox: { x: 45.2, y: 32.1, z: 18.7 }
    },
    issues: [
      {
        type: 'warning',
        category: 'Geometry',
        description: 'Thin walls detected (0.8mm) - may be fragile',
        severity: 6,
        fixSuggestion: 'Increase wall thickness to minimum 1.2mm for better durability'
      },
      {
        type: 'info',
        category: 'Support',
        description: 'Overhangs require support structures',
        severity: 3,
        fixSuggestion: 'Add support structures for angles > 45° or redesign overhangs'
      },
      {
        type: 'critical',
        category: 'Manifold',
        description: 'Non-manifold edges found',
        severity: 9,
        fixSuggestion: 'Repair mesh using CAD software to ensure watertight geometry'
      }
    ],
    materialRecommendations: [
      {
        material: 'PLA+',
        compatibility: 95,
        properties: ['Easy to print', 'Good surface finish', 'Biodegradable'],
        costEstimate: '₹45-65 per print'
      },
      {
        material: 'PETG',
        compatibility: 88,
        properties: ['Chemical resistant', 'Strong', 'Transparent options'],
        costEstimate: '₹65-85 per print'
      },
      {
        material: 'ABS',
        compatibility: 75,
        properties: ['Heat resistant', 'Durable', 'Post-processing friendly'],
        costEstimate: '₹55-75 per print'
      }
    ],
    printingTechniques: [
      {
        technique: 'FDM',
        suitability: 90,
        requirements: ['0.2mm layer height', '20% infill', 'Tree supports'],
        timeEstimate: '4h 32m'
      },
      {
        technique: 'SLA',
        suitability: 85,
        requirements: ['0.05mm layer height', 'Heavy supports', 'Post-curing'],
        timeEstimate: '2h 45m'
      }
    ],
    qualityMetrics: {
      manifold: false,
      watertight: true,
      supportRequired: true,
      printTime: '4h 32m',
      materialUsage: '85g'
    }
  };

  const handleContinueToErrors = () => {
    setCurrentStep('errors');
  };

  const handleContinueToPricing = () => {
    const criticalIssues = analysisData.issues.filter(issue => issue.type === 'critical');
    const canPrint = criticalIssues.length === 0;
    
    if (onAnalysisComplete) {
      onAnalysisComplete(canPrint);
    }
    
    setCurrentStep('pricing');
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-destructive';
    if (severity >= 5) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (currentStep === 'analysis') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Model Analysis Report</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your 3D model for optimal printing</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Overall Printability Score
              </CardTitle>
              <Badge variant={analysisData.printabilityScore >= 85 ? "default" : analysisData.printabilityScore >= 70 ? "secondary" : "destructive"}>
                {analysisData.printabilityScore >= 85 ? "Excellent" : analysisData.printabilityScore >= 70 ? "Good" : "Needs Work"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Printability Score</span>
                <span className="text-2xl font-bold text-primary">{analysisData.printabilityScore}/100</span>
              </div>
              <Progress value={analysisData.printabilityScore} className="h-3" />
              <p className="text-sm text-muted-foreground">
                This score is based on geometry analysis, printability factors, and material compatibility.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Geometry Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Vertices:</span>
                  <span className="ml-2 font-medium">{analysisData.geometryAnalysis.vertices.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Faces:</span>
                  <span className="ml-2 font-medium">{analysisData.geometryAnalysis.faces.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="ml-2 font-medium">{analysisData.geometryAnalysis.volume} cm³</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface Area:</span>
                  <span className="ml-2 font-medium">{analysisData.geometryAnalysis.surfaceArea} cm²</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-muted-foreground">Dimensions (L×W×H):</span>
                <div className="font-medium">
                  {analysisData.geometryAnalysis.boundingBox.x} × {analysisData.geometryAnalysis.boundingBox.y} × {analysisData.geometryAnalysis.boundingBox.z} mm
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manifold Geometry</span>
                  {analysisData.qualityMetrics.manifold ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-destructive" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Watertight</span>
                  {analysisData.qualityMetrics.watertight ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-destructive" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Support Required</span>
                  <Badge variant={analysisData.qualityMetrics.supportRequired ? "secondary" : "default"}>
                    {analysisData.qualityMetrics.supportRequired ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Est. Print Time</span>
                  <span className="font-medium">{analysisData.qualityMetrics.printTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Material Usage</span>
                  <span className="font-medium">{analysisData.qualityMetrics.materialUsage}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Materials & Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="techniques">Printing Techniques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials" className="space-y-4">
                {analysisData.materialRecommendations.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{material.material}</span>
                        <Badge variant="outline">{material.compatibility}% match</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {material.properties.join(" • ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{material.costEstimate}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="techniques" className="space-y-4">
                {analysisData.printingTechniques.map((technique, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{technique.technique}</span>
                        <Badge variant="outline">{technique.suitability}% suitable</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {technique.requirements.join(" • ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{technique.timeEstimate}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleContinueToErrors} className="flex items-center gap-2">
            Continue to Error Analysis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'errors') {
    const criticalIssues = analysisData.issues.filter(issue => issue.type === 'critical');
    const warningIssues = analysisData.issues.filter(issue => issue.type === 'warning');
    const infoIssues = analysisData.issues.filter(issue => issue.type === 'info');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Analysis & Fixes</h2>
          <p className="text-muted-foreground">Detailed analysis of potential printing issues and suggested fixes</p>
        </div>

        {criticalIssues.length > 0 && (
          <Alert className="border-destructive bg-destructive/10">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Issues Found:</strong> These must be fixed before printing to ensure success.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {criticalIssues.length > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Critical Issues ({criticalIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {criticalIssues.map((issue, index) => (
                  <div key={index} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{issue.category}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
                            <span className="text-xs text-muted-foreground">Severity: {issue.severity}/10</span>
                          </div>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        {issue.fixSuggestion && (
                          <div className="p-2 bg-muted rounded text-sm">
                            <strong>Fix:</strong> {issue.fixSuggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {warningIssues.length > 0 && (
            <Card className="border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  Warnings ({warningIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warningIssues.map((issue, index) => (
                  <div key={index} className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-50/50">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{issue.category}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
                            <span className="text-xs text-muted-foreground">Severity: {issue.severity}/10</span>
                          </div>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        {issue.fixSuggestion && (
                          <div className="p-2 bg-muted rounded text-sm">
                            <strong>Suggestion:</strong> {issue.fixSuggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {infoIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Info className="h-5 w-5" />
                  Information ({infoIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {infoIssues.map((issue, index) => (
                  <div key={index} className="p-4 border border-blue-500/20 rounded-lg bg-blue-50/50">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{issue.category}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
                            <span className="text-xs text-muted-foreground">Severity: {issue.severity}/10</span>
                          </div>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        {issue.fixSuggestion && (
                          <div className="p-2 bg-muted rounded text-sm">
                            <strong>Tip:</strong> {issue.fixSuggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('analysis')}>
            Back to Analysis
          </Button>
          <Button 
            onClick={handleContinueToPricing}
            disabled={criticalIssues.length > 0}
            className="flex items-center gap-2"
          >
            {criticalIssues.length > 0 ? 'Fix Critical Issues First' : 'Continue to Pricing'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'pricing') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Print with CadQua 3D</h2>
          <p className="text-muted-foreground">Your model has been analyzed and is ready for professional 3D printing</p>
        </div>

        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Analysis Complete!</strong> Your model is ready for 3D printing with the recommended materials and settings.
          </AlertDescription>
        </Alert>

        <CadQuaPricing 
          modelId={modelId}
          modelName={modelName}
          fileUrl={fileUrl}
          onOrderPlaced={(orderId) => {
            console.log('Order placed:', orderId);
          }}
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('errors')}>
            Back to Error Analysis
          </Button>
          <Button onClick={onPurchase} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Purchase & Download Model
          </Button>
        </div>
      </div>
    );
  }

  return null;
};