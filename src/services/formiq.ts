
import { saveFormIQAnalysis } from "@/lib/supabase";

// Interfaces
export interface DesignIssue {
  issue: string;
  severity: string;
}

export interface OemCompatibility {
  name: string;
  score: number;
}

export interface FormIQAnalysisResult {
  printabilityScore: number;
  materialRecommendations: string[];
  printingTechniques: string[];
  designIssues: DesignIssue[];
  oemCompatibility: OemCompatibility[];
  qualityStatus: 'approved' | 'declined' | 'reviewing';
  qualityNotes?: string;
}

// FormIQ analysis service
export const analyzeModel = async (modelPath: string, modelName: string): Promise<FormIQAnalysisResult> => {
  // In a real implementation, this would call an API or edge function
  // For now, we'll simulate the analysis
  
  // Simulate analysis processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a random but realistic analysis
  const printabilityScore = Math.floor(Math.random() * 25) + 75; // 75-100 range
  
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

  // Generate some design issues based on the score
  const designIssues: DesignIssue[] = [];
  if (printabilityScore < 85) {
    designIssues.push({ issue: "Thin walls in section A-2", severity: "Medium" });
    designIssues.push({ issue: "Sharp interior corners", severity: "Low" });
  }
  if (printabilityScore < 90) {
    designIssues.push({ issue: "Unsupported overhangs", severity: "High" });
  }

  // Generate OEM compatibility
  const oemCompatibility: OemCompatibility[] = [
    { name: "Prusa", score: Math.floor(Math.random() * 10) + 85 },
    { name: "Creality", score: Math.floor(Math.random() * 10) + 85 },
    { name: "Ultimaker", score: Math.floor(Math.random() * 10) + 85 },
    { name: "Anycubic", score: Math.floor(Math.random() * 10) + 85 }
  ];

  // Determine quality status based on printability score
  const qualityStatus: 'approved' | 'declined' | 'reviewing' = 
    printabilityScore >= 70 ? 'approved' : 'declined';
  
  const qualityNotes = printabilityScore >= 70 
    ? 'Model meets quality standards for marketplace listing'
    : `Model quality score (${printabilityScore}%) is below the required threshold of 70%`;

  return {
    printabilityScore,
    materialRecommendations,
    printingTechniques,
    designIssues,
    oemCompatibility,
    qualityStatus,
    qualityNotes
  };
};

// Save FormIQ analysis to database
export const saveAnalysis = async (modelId: string, analysis: FormIQAnalysisResult) => {
  return await saveFormIQAnalysis(modelId, {
    printability_score: analysis.printabilityScore,
    material_recommendations: analysis.materialRecommendations,
    printing_techniques: analysis.printingTechniques,
    design_issues: analysis.designIssues,
    oem_compatibility: analysis.oemCompatibility
  });
};
