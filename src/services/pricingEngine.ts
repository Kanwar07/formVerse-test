import { CompetitorPricingService, CompetitorBenchmark } from './competitorPricing';
import { LocalizationService, LocalizedPrice } from './localizationPricing';
import { generatePricingSuggestion, FormIQPricingResult } from './formiq';
import { ModelInsightsService, GeneratedInsights } from './modelInsights';

export interface PricingEngineResult {
  competitorBenchmark: {
    summary: string;
    details: string[];
    averagePrice: number;
    analysis: {
      position: 'below' | 'competitive' | 'premium';
      message: string;
      competitiveness: number;
    };
  };
  formiqSuggestion: {
    price: number;
    rationale: string[];
    confidenceScore: number;
  };
  localizedPrice: LocalizedPrice;
  recommendations: {
    finalSuggestedPrice: number;
    adjustmentReasons: string[];
    pricingStrategy: string;
  };
}

export class PricingEngine {
  /**
   * Generate comprehensive pricing analysis and recommendations
   */
  static async generatePricingAnalysis(
    modelName: string,
    description: string = '',
    printabilityScore: number = 85,
    region?: string
  ): Promise<PricingEngineResult> {
    
    // Step 1: Generate model insights and categorization
    const insights = ModelInsightsService.generateInsights(modelName, description);
    
    // Step 2: Get competitor benchmark
    const competitorBenchmark = CompetitorPricingService.getCompetitorBenchmark(
      [...insights.tags, ...insights.targetIndustries]
    );
    
    // Step 3: Generate FormIQ pricing suggestion
    const formiqResult = generatePricingSuggestion(
      modelName,
      description,
      printabilityScore,
      insights.tags,
      insights.targetIndustries
    );
    
    // Step 4: Analyze against competitors
    const competitorAnalysis = CompetitorPricingService.analyzePricingPosition(
      formiqResult.suggestedPrice,
      competitorBenchmark
    );
    
    // Step 5: Generate final recommendations
    const recommendations = this.generateRecommendations(
      formiqResult,
      competitorBenchmark,
      insights,
      competitorAnalysis
    );
    
    // Step 6: Localize pricing
    const localizedPrice = LocalizationService.localizePrice(
      recommendations.finalSuggestedPrice,
      region
    );
    
    // Format competitor data
    const competitorDisplay = CompetitorPricingService.formatForDisplay(competitorBenchmark);
    
    return {
      competitorBenchmark: {
        ...competitorDisplay,
        analysis: competitorAnalysis
      },
      formiqSuggestion: {
        price: formiqResult.suggestedPrice,
        rationale: formiqResult.rationale,
        confidenceScore: formiqResult.confidenceScore
      },
      localizedPrice,
      recommendations
    };
  }

  /**
   * Generate final pricing recommendations
   */
  private static generateRecommendations(
    formiqResult: FormIQPricingResult,
    competitorBenchmark: CompetitorBenchmark,
    insights: GeneratedInsights,
    competitorAnalysis: any
  ): {
    finalSuggestedPrice: number;
    adjustmentReasons: string[];
    pricingStrategy: string;
  } {
    let finalPrice = formiqResult.suggestedPrice;
    const adjustmentReasons: string[] = [];
    
    // Adjust based on competitor analysis
    if (competitorAnalysis.position === 'below' && formiqResult.confidenceScore > 80) {
      // If we're significantly below market and confident in our analysis, increase slightly
      const adjustment = Math.min(competitorBenchmark.overallRange.average * 0.1, finalPrice * 0.2);
      finalPrice += adjustment;
      adjustmentReasons.push(`Increased by $${Math.round(adjustment)} to better align with market standards`);
    } else if (competitorAnalysis.position === 'premium' && formiqResult.confidenceScore < 70) {
      // If we're premium pricing but not confident, reduce slightly
      const adjustment = finalPrice * 0.1;
      finalPrice -= adjustment;
      adjustmentReasons.push(`Reduced by $${Math.round(adjustment)} to improve market competitiveness`);
    }
    
    // Market demand adjustments
    if (insights.marketDemand === 'High' && competitorAnalysis.competitiveness > 70) {
      adjustmentReasons.push('Premium positioning supported by high market demand');
    } else if (insights.marketDemand === 'Low') {
      adjustmentReasons.push('Competitive positioning for broader market appeal');
    }
    
    // Quality-based adjustments
    if (formiqResult.pricingFactors.printabilityBonus > 1.05) {
      adjustmentReasons.push('Premium justified by excellent print quality and reliability');
    }
    
    // Determine pricing strategy
    let pricingStrategy = 'Competitive Pricing';
    if (finalPrice > competitorBenchmark.overallRange.average * 1.2) {
      pricingStrategy = 'Premium Positioning';
    } else if (finalPrice < competitorBenchmark.overallRange.average * 0.8) {
      pricingStrategy = 'Value Pricing';
    }
    
    return {
      finalSuggestedPrice: Math.round(finalPrice),
      adjustmentReasons,
      pricingStrategy
    };
  }

  /**
   * Quick pricing estimate for preview
   */
  static getQuickEstimate(
    modelName: string,
    description: string = ''
  ): { estimatedPrice: number; confidence: 'Low' | 'Medium' | 'High' } {
    const insights = ModelInsightsService.generateInsights(modelName, description);
    const competitorBenchmark = CompetitorPricingService.getCompetitorBenchmark(
      [...insights.tags, ...insights.targetIndustries]
    );
    
    // Simple estimation based on category average
    const estimatedPrice = Math.round(competitorBenchmark.overallRange.average);
    
    // Confidence based on available information
    const hasDescription = description.length > 10;
    const hasSpecificTags = insights.tags.length > 3;
    
    let confidence: 'Low' | 'Medium' | 'High' = 'Low';
    if (hasDescription && hasSpecificTags) confidence = 'High';
    else if (hasDescription || hasSpecificTags) confidence = 'Medium';
    
    return { estimatedPrice, confidence };
  }

  /**
   * Compare pricing across multiple regions
   */
  static compareRegionalPricing(usdPrice: number): LocalizedPrice[] {
    return LocalizationService.compareRegionalPricing(usdPrice);
  }

  /**
   * Get pricing insights for analytics
   */
  static getPricingInsights(results: PricingEngineResult): {
    marketPosition: string;
    recommendedAction: string;
    keyFactors: string[];
  } {
    const { competitorBenchmark, recommendations, localizedPrice } = results;
    
    const insights = {
      marketPosition: `${recommendations.pricingStrategy} - ${competitorBenchmark.analysis.position} market position`,
      recommendedAction: this.getRecommendedAction(competitorBenchmark.analysis),
      keyFactors: [
        `${Math.round(competitorBenchmark.analysis.competitiveness)}% competitive score`,
        `${LocalizationService.getPricingExplanation(localizedPrice)}`,
        ...recommendations.adjustmentReasons.slice(0, 2)
      ]
    };
    
    return insights;
  }

  private static getRecommendedAction(analysis: any): string {
    switch (analysis.position) {
      case 'below':
        return 'Consider increasing price for better perceived value';
      case 'premium':
        return 'Ensure model quality justifies premium pricing';
      case 'competitive':
        return 'Well-positioned for market success';
      default:
        return 'Review pricing strategy';
    }
  }
}