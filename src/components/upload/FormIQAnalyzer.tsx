
import { useState, useEffect } from "react";
import { AnalysisProgress } from "./AnalysisProgress";
import { PrintabilityCard } from "./PrintabilityCard";
import { Brain } from "lucide-react";
import { analyzeModel, FormIQAnalysisResult } from "@/services/formiq";

interface FormIQAnalyzerProps {
  analyzing: boolean;
  analysisComplete: boolean;
  modelPath?: string;
  modelName?: string;
  printabilityScore: number;
  materialRecommendations: string[];
  printingTechniques: string[];
  designIssues: {issue: string; severity: string}[];
  oemCompatibility: {name: string; score: number}[];
  onContinue: () => void;
  onAnalysisComplete?: (result: FormIQAnalysisResult) => void;
}

export const FormIQAnalyzer = ({ 
  analyzing,
  analysisComplete,
  modelPath,
  modelName,
  printabilityScore,
  materialRecommendations,
  printingTechniques,
  designIssues,
  oemCompatibility,
  onContinue,
  onAnalysisComplete
}: FormIQAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(analyzing);
  const [analysisFinished, setAnalysisFinished] = useState(analysisComplete);
  const [result, setResult] = useState<FormIQAnalysisResult>({
    printabilityScore,
    materialRecommendations,
    printingTechniques,
    designIssues,
    oemCompatibility
  });

  useEffect(() => {
    setIsAnalyzing(analyzing);
    setAnalysisFinished(analysisComplete);
  }, [analyzing, analysisComplete]);

  useEffect(() => {
    const runAnalysis = async () => {
      if (isAnalyzing && modelPath && modelName) {
        try {
          const analysisResult = await analyzeModel(modelPath, modelName);
          setResult(analysisResult);
          setIsAnalyzing(false);
          setAnalysisFinished(true);
          
          if (onAnalysisComplete) {
            onAnalysisComplete(analysisResult);
          }
        } catch (error) {
          console.error("Error analyzing model:", error);
          setIsAnalyzing(false);
        }
      }
    };

    if (isAnalyzing && modelPath && modelName) {
      runAnalysis();
    }
  }, [isAnalyzing, modelPath, modelName, onAnalysisComplete]);

  if (!isAnalyzing && !analysisFinished) return null;

  return (
    <>
      {isAnalyzing && <AnalysisProgress />}
      
      {analysisFinished && (
        <div className="mt-6 w-full">
          <div className="flex items-center mb-4">
            <Brain className="h-5 w-5 text-[#9b87f5] mr-2" />
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#7E69AB] to-[#9b87f5]">FormIQ Analysis Results</span>
            <div className="ml-2 flex items-center">
              <span className="text-sm text-muted-foreground mr-1">(The Brain of</span>
              <div className="relative h-4 w-4 mr-1">
                <img 
                  src="/lovable-uploads/9ce09c17-cfd4-43bc-a961-0bd805bee565.png" 
                  alt="FormVerse Logo" 
                  className="h-4 w-4"
                />
              </div>
              <span className="text-sm text-muted-foreground">FormVerse)</span>
            </div>
          </div>
          
          <PrintabilityCard 
            printabilityScore={result.printabilityScore}
            oemCompatibility={result.oemCompatibility}
            materialRecommendations={result.materialRecommendations}
            designIssues={result.designIssues}
            onContinue={onContinue}
          />
        </div>
      )}
    </>
  );
};
