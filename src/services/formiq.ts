
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

// Enhanced FormIQ analysis service with pricing logic
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

// New pricing interfaces
export interface PricingFactors {
  complexityMultiplier: number;
  printabilityBonus: number;
  marketDemandMultiplier: number;
  categoryBasePrice: number;
}

export interface FormIQPricingResult {
  suggestedPrice: number;
  pricingFactors: PricingFactors;
  rationale: string[];
  confidenceScore: number; // 0-100
}

/**
 * Generate AI-powered pricing suggestion based on model analysis
 */
export const generatePricingSuggestion = (
  modelName: string,
  description: string = '',
  printabilityScore: number,
  tags: string[],
  targetIndustries: string[]
): FormIQPricingResult => {
  // Base pricing logic
  const complexityScore = calculateComplexityScore(modelName, description, tags);
  const marketDemand = assessMarketDemand(tags, targetIndustries);
  
  // Determine category base price
  const categoryBasePrice = getCategoryBasePrice(tags, targetIndustries);
  
  // Calculate multipliers
  const complexityMultiplier = 1 + (complexityScore * 0.5); // 1.0 to 1.5x
  const printabilityBonus = printabilityScore > 85 ? 1.1 : printabilityScore > 75 ? 1.05 : 1.0;
  const marketDemandMultiplier = marketDemand === 'High' ? 1.3 : marketDemand === 'Medium' ? 1.1 : 0.9;
  
  // Calculate final price
  const basePrice = categoryBasePrice;
  const adjustedPrice = basePrice * complexityMultiplier * printabilityBonus * marketDemandMultiplier;
  
  // Round to sensible increment (nearest $5)
  const suggestedPrice = Math.round(adjustedPrice / 5) * 5;
  
  // Generate rationale
  const rationale = generatePricingRationale({
    complexityMultiplier,
    printabilityBonus,
    marketDemandMultiplier,
    categoryBasePrice: basePrice
  }, printabilityScore, marketDemand);
  
  // Calculate confidence score
  const confidenceScore = calculatePricingConfidence(complexityScore, printabilityScore, tags.length);
  
  return {
    suggestedPrice: Math.max(suggestedPrice, 10), // Minimum $10
    pricingFactors: {
      complexityMultiplier,
      printabilityBonus,
      marketDemandMultiplier,
      categoryBasePrice: basePrice
    },
    rationale,
    confidenceScore
  };
};

/**
 * Calculate model complexity score based on name, description, and tags
 */
function calculateComplexityScore(modelName: string, description: string, tags: string[]): number {
  let score = 0.5; // Base complexity
  
  const content = `${modelName} ${description}`.toLowerCase();
  const allTags = tags.map(t => t.toLowerCase());
  
  // Complexity indicators
  const complexityKeywords = [
    'assembly', 'multi-part', 'complex', 'detailed', 'intricate', 'advanced',
    'precision', 'high-resolution', 'fine-detail', 'multi-component'
  ];
  
  const simpleKeywords = [
    'basic', 'simple', 'minimal', 'prototype', 'concept'
  ];
  
  // Check content for complexity indicators
  complexityKeywords.forEach(keyword => {
    if (content.includes(keyword) || allTags.some(tag => tag.includes(keyword))) {
      score += 0.1;
    }
  });
  
  simpleKeywords.forEach(keyword => {
    if (content.includes(keyword) || allTags.some(tag => tag.includes(keyword))) {
      score -= 0.1;
    }
  });
  
  // Tag diversity indicates complexity
  if (tags.length > 5) score += 0.1;
  if (tags.length > 8) score += 0.1;
  
  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
}

/**
 * Assess market demand based on tags and industries
 */
function assessMarketDemand(tags: string[], targetIndustries: string[]): 'High' | 'Medium' | 'Low' {
  const highDemandCategories = ['automotive', 'medical', 'aerospace', 'engineering'];
  const mediumDemandCategories = ['architecture', 'manufacturing', 'tool', 'mechanical'];
  
  const allCategories = [...tags, ...targetIndustries].map(c => c.toLowerCase());
  
  const hasHighDemand = highDemandCategories.some(cat => 
    allCategories.some(userCat => userCat.includes(cat))
  );
  
  const hasMediumDemand = mediumDemandCategories.some(cat => 
    allCategories.some(userCat => userCat.includes(cat))
  );
  
  if (hasHighDemand) return 'High';
  if (hasMediumDemand) return 'Medium';
  return 'Low';
}

/**
 * Get base price for category
 */
function getCategoryBasePrice(tags: string[], targetIndustries: string[]): number {
  const allCategories = [...tags, ...targetIndustries].map(c => c.toLowerCase());
  
  const categoryPrices: Record<string, number> = {
    medical: 45,
    aerospace: 40,
    automotive: 35,
    engineering: 30,
    architecture: 28,
    manufacturing: 25,
    mechanical: 22,
    tool: 20,
    consumer: 15,
    toy: 12
  };
  
  for (const [category, price] of Object.entries(categoryPrices)) {
    if (allCategories.some(userCat => userCat.includes(category))) {
      return price;
    }
  }
  
  return 20; // Default base price
}

/**
 * Generate human-readable pricing rationale
 */
function generatePricingRationale(
  factors: PricingFactors,
  printabilityScore: number,
  marketDemand: string
): string[] {
  const rationale: string[] = [];
  
  rationale.push(`Base price determined by model category: $${factors.categoryBasePrice}`);
  
  if (factors.complexityMultiplier > 1.2) {
    rationale.push(`+${Math.round((factors.complexityMultiplier - 1) * 100)}% for high complexity design`);
  } else if (factors.complexityMultiplier > 1.05) {
    rationale.push(`+${Math.round((factors.complexityMultiplier - 1) * 100)}% for moderate complexity`);
  }
  
  if (factors.printabilityBonus > 1.05) {
    rationale.push(`+${Math.round((factors.printabilityBonus - 1) * 100)}% bonus for excellent printability (${printabilityScore}% score)`);
  }
  
  if (factors.marketDemandMultiplier > 1.1) {
    rationale.push(`+${Math.round((factors.marketDemandMultiplier - 1) * 100)}% for ${marketDemand.toLowerCase()} market demand`);
  } else if (factors.marketDemandMultiplier < 1) {
    rationale.push(`${Math.round((1 - factors.marketDemandMultiplier) * 100)}% adjustment for lower market demand`);
  }
  
  return rationale;
}

/**
 * Calculate confidence score for pricing suggestion
 */
function calculatePricingConfidence(
  complexityScore: number,
  printabilityScore: number,
  tagCount: number
): number {
  let confidence = 70; // Base confidence
  
  // Higher printability score increases confidence
  confidence += (printabilityScore - 75) * 0.4;
  
  // More tags = better categorization = higher confidence
  confidence += Math.min(tagCount * 2, 15);
  
  // Moderate complexity is more predictable
  if (complexityScore > 0.3 && complexityScore < 0.7) {
    confidence += 10;
  }
  
  return Math.max(60, Math.min(95, Math.round(confidence)));
}

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
