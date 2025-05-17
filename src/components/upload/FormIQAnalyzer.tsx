
import { useState, useEffect } from "react";
import { AnalysisProgress } from "./AnalysisProgress";
import { PrintabilityCard } from "./PrintabilityCard";

interface DesignIssue {
  issue: string;
  severity: string;
}

interface OemCompatibility {
  name: string;
  score: number;
}

interface FormIQAnalyzerProps {
  analyzing: boolean;
  analysisComplete: boolean;
  printabilityScore: number;
  materialRecommendations: string[];
  printingTechniques: string[];
  designIssues: DesignIssue[];
  oemCompatibility: OemCompatibility[];
  onContinue: () => void;
}

export const FormIQAnalyzer = ({ 
  analyzing,
  analysisComplete,
  printabilityScore,
  materialRecommendations,
  printingTechniques,
  designIssues,
  oemCompatibility,
  onContinue
}: FormIQAnalyzerProps) => {
  if (!analyzing && !analysisComplete) return null;

  return (
    <>
      {analyzing && <AnalysisProgress />}
      
      {analysisComplete && (
        <div className="mt-6 w-full">
          <div className="flex items-center mb-4">
            <Brain className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">FormIQ Analysis Results</span>
          </div>
          
          <PrintabilityCard 
            printabilityScore={printabilityScore}
            oemCompatibility={oemCompatibility}
            materialRecommendations={materialRecommendations}
            designIssues={designIssues}
            onContinue={onContinue}
          />
        </div>
      )}
    </>
  );
};

// Add missing import
import { Brain } from "lucide-react";
