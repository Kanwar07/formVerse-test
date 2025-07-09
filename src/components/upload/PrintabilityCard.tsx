
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileCheck, FileX, Settings, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface OemCompatibility {
  name: string;
  score: number;
}

interface MaterialRecommendation {
  material: string;
  description: string;
}

interface DesignIssue {
  issue: string;
  severity: string;
}

interface PrintabilityCardProps {
  printabilityScore: number;
  oemCompatibility: OemCompatibility[];
  materialRecommendations: string[];
  designIssues: DesignIssue[];
  qualityStatus: 'approved' | 'declined' | 'reviewing';
  qualityNotes?: string;
  onContinue: () => void;
}

export const PrintabilityCard = ({
  printabilityScore,
  oemCompatibility,
  materialRecommendations,
  designIssues,
  qualityStatus,
  qualityNotes,
  onContinue
}: PrintabilityCardProps) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-between">
        <h3 className="font-medium">Printability Score</h3>
        <div className="flex items-center">
          <span className={`text-lg font-bold ${printabilityScore >= 90 ? 'text-emerald-500' : printabilityScore >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
            {printabilityScore}/100
          </span>
        </div>
      </div>
      <CardContent className="pt-4">
        <Progress 
          value={printabilityScore} 
          className="h-2 mb-4"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FileCheck className="h-4 w-4 mr-2 text-emerald-500" />
              OEM Compatibility
            </h4>
            <div className="space-y-2">
              {oemCompatibility.map((oem, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{oem.name}</span>
                  <span className={`${oem.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {oem.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2 text-primary" />
              Material Recommendations
            </h4>
            <ul className="text-xs space-y-1">
              {materialRecommendations.map((material, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary/70 mr-2"></span>
                  {material}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FileX className="h-4 w-4 mr-2 text-red-500" />
              Design Issues
            </h4>
            <ul className="text-xs space-y-1">
              {designIssues.map((issue, index) => (
                <li key={index} className="flex justify-between">
                  <span>{issue.issue}</span>
                  <Badge variant={issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "default" : "outline"} className="text-[10px] py-0 h-4">
                    {issue.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quality Status Section */}
        <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              {qualityStatus === 'approved' && <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />}
              {qualityStatus === 'declined' && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
              {qualityStatus === 'reviewing' && <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />}
              Quality Check Status
            </h4>
            <Badge 
              variant={qualityStatus === 'approved' ? 'default' : qualityStatus === 'declined' ? 'destructive' : 'secondary'}
              className={
                qualityStatus === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' :
                qualityStatus === 'declined' ? 'bg-red-500 hover:bg-red-600' :
                'bg-amber-500 hover:bg-amber-600'
              }
            >
              {qualityStatus.charAt(0).toUpperCase() + qualityStatus.slice(1)}
            </Badge>
          </div>
          {qualityNotes && (
            <p className="text-xs text-muted-foreground mb-3">{qualityNotes}</p>
          )}
          
          {qualityStatus === 'approved' && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md">
              <p className="text-sm text-emerald-800 font-medium">✅ Model Approved for Marketplace</p>
              <p className="text-xs text-emerald-600 mt-1">Your model meets our quality standards and can proceed to listing.</p>
            </div>
          )}
          
          {qualityStatus === 'declined' && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-sm text-red-800 font-medium">❌ Model Quality Below Standards</p>
              <p className="text-xs text-red-600 mt-1">Please improve your model quality to meet the minimum 70% threshold before resubmitting.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onContinue}
            disabled={qualityStatus === 'declined'}
            className="flex items-center"
          >
            {qualityStatus === 'approved' ? 'Continue to Listing' : 
             qualityStatus === 'declined' ? 'Quality Check Failed' : 
             'Continue with analysis'}
            {qualityStatus !== 'declined' && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
