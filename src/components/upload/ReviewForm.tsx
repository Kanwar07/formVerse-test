import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { PreviewSelector } from "@/components/preview/PreviewSelector";

interface DesignIssue {
  issue: string;
  severity: string;
}

interface ReviewFormProps {
  printabilityScore: number;
  printingTechniques: string[];
  materialRecommendations: string[];
  designIssues: DesignIssue[];
  actualPrice: number;
  onBack: () => void;
  onSubmit: () => void;
}

export const ReviewForm = ({ 
  printabilityScore, 
  printingTechniques, 
  materialRecommendations, 
  designIssues, 
  actualPrice,
  onBack, 
  onSubmit
}: ReviewFormProps) => {
  const originalImage = "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3";

  return (
    <div className="space-y-6">
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted p-4">
          <h3 className="font-semibold">Model Preview</h3>
        </div>
        <div className="p-6">
          <PreviewSelector
            modelName="Industrial Gear Assembly"
            thumbnail={originalImage}
            isOwner={true}
            isPurchased={false}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Model Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">Industrial Gear Assembly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">File Type:</span>
              <span className="font-medium">STL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">File Size:</span>
              <span className="font-medium">24.3 MB</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Pricing & License</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">₹{actualPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">License:</span>
              <span className="font-medium">Commercial</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee:</span>
              <span className="font-medium">10%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-xl p-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-5 w-5 text-primary" />
          <h4 className="font-medium">FormIQ Analysis Results</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Printability Score</span>
              <span className="text-sm font-medium">{printabilityScore}/100</span>
            </div>
            <Progress value={printabilityScore} className="h-2" />
          </div>
          
          <div className="text-sm">
            <p className="font-medium">AI Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mt-1">
              <li>Model is optimized for {printingTechniques[0]?.split(" - ")[0] || "FDM"} printing</li>
              <li>Compatible with {materialRecommendations.slice(0, 2).map(m => m.split(" - ")[0]).join(", ")} materials</li>
              {designIssues.length > 0 && (
                <li>Consider fixing {designIssues.filter(i => i.severity === "High").length} high-priority design issues</li>
              )}
            </ul>
          </div>
        </div>
        
        <Button variant="outline" className="mt-4" size="sm" asChild>
          <Link to={`/printability/model-1`}>View Full Report</Link>
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onSubmit}>Publish Model</Button>
      </div>
    </div>
  );
};
