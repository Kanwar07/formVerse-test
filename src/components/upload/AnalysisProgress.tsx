
import { Brain, Check } from "lucide-react";

export const AnalysisProgress = () => {
  return (
    <div className="mt-6 w-full max-w-xl">
      <div className="flex items-center mb-4">
        <Brain className="h-5 w-5 text-primary animate-pulse mr-2" />
        <span className="font-medium">FormIQ is analyzing your model...</span>
      </div>
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-muted/30 flex items-center">
          <Check className="h-4 w-4 text-emerald-500 mr-2" />
          <span className="text-sm">Analyzing mesh topology...</span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 flex items-center">
          <Check className="h-4 w-4 text-emerald-500 mr-2" />
          <span className="text-sm">Identifying key features...</span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 flex items-center animate-pulse">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
          <span className="text-sm">Calculating printability score...</span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 flex items-center opacity-50">
          <div className="h-4 w-4 mr-2"></div>
          <span className="text-sm">Generating optimal tags...</span>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 flex items-center opacity-50">
          <div className="h-4 w-4 mr-2"></div>
          <span className="text-sm">Creating pricing recommendations...</span>
        </div>
      </div>
    </div>
  );
};
