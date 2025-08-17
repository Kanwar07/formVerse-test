export interface GeneratedInsights {
  tags: string[];
  marketDemand: 'High' | 'Medium' | 'Low';
  targetIndustries: string[];
  printingTechniques: string[];
  materialRecommendations: string[];
}

export class ModelInsightsService {
  /**
   * Generate basic insights and tags for a model based on name and description
   */
  static generateInsights(modelName: string, description?: string): GeneratedInsights {
    const content = `${modelName} ${description || ''}`.toLowerCase();
    
    // Initialize with default tags
    const tags = new Set(['3D model', 'engineering']);
    const targetIndustries = new Set<string>();
    const materialRecommendations = new Set(['PLA', 'ABS']);
    const printingTechniques = new Set(['FDM']);

    // Rule-based tag and industry assignment
    if (content.includes('gear')) {
      tags.add('mechanical');
      tags.add('industrial');
      tags.add('gear');
      targetIndustries.add('Engineering');
      targetIndustries.add('Manufacturing');
      materialRecommendations.add('PETG');
      printingTechniques.add('SLA');
    }

    if (content.includes('housing') || content.includes('frame') || content.includes('bracket')) {
      tags.add('architecture');
      tags.add('structural');
      tags.add('housing');
      targetIndustries.add('Architecture');
      targetIndustries.add('Construction');
      materialRecommendations.add('PETG');
    }

    if (content.includes('medical') || content.includes('enclosure') || content.includes('prosthetic')) {
      tags.add('medical');
      tags.add('device');
      tags.add('healthcare');
      targetIndustries.add('Healthcare');
      targetIndustries.add('Medical Devices');
      materialRecommendations.add('TPU');
      printingTechniques.add('SLA');
    }

    if (content.includes('automotive') || content.includes('car') || content.includes('vehicle')) {
      tags.add('automotive');
      tags.add('vehicle');
      targetIndustries.add('Automotive');
      materialRecommendations.add('Carbon Fiber');
      printingTechniques.add('SLS');
    }

    if (content.includes('prototype') || content.includes('test')) {
      tags.add('prototype');
      tags.add('testing');
      targetIndustries.add('R&D');
    }

    if (content.includes('toy') || content.includes('game') || content.includes('figurine')) {
      tags.add('toy');
      tags.add('entertainment');
      tags.add('consumer');
      targetIndustries.add('Entertainment');
      targetIndustries.add('Consumer Goods');
      materialRecommendations.add('PLA');
    }

    if (content.includes('tool') || content.includes('wrench') || content.includes('clamp')) {
      tags.add('tool');
      tags.add('utility');
      tags.add('workshop');
      targetIndustries.add('Manufacturing');
      targetIndustries.add('Workshop');
      materialRecommendations.add('PETG');
      materialRecommendations.add('Nylon');
    }

    if (content.includes('jewelry') || content.includes('ring') || content.includes('pendant')) {
      tags.add('jewelry');
      tags.add('accessories');
      tags.add('fashion');
      targetIndustries.add('Fashion');
      targetIndustries.add('Jewelry');
      printingTechniques.add('SLA');
      printingTechniques.add('Lost Wax Casting');
    }

    // Generate market demand (random for now, but could be based on tag popularity)
    const demandOptions: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
    const marketDemand = demandOptions[Math.floor(Math.random() * demandOptions.length)];

    // Add SLA as alternative for precision parts
    if (tags.has('precision') || tags.has('medical') || tags.has('jewelry')) {
      printingTechniques.add('SLA');
    }

    // Ensure we have at least one industry
    if (targetIndustries.size === 0) {
      targetIndustries.add('General Manufacturing');
    }

    return {
      tags: Array.from(tags),
      marketDemand,
      targetIndustries: Array.from(targetIndustries),
      printingTechniques: Array.from(printingTechniques),
      materialRecommendations: Array.from(materialRecommendations)
    };
  }

  /**
   * Format insights for display in UI
   */
  static formatInsightsForDisplay(insights: GeneratedInsights) {
    return {
      marketAnalysis: {
        demand: insights.marketDemand,
        industries: insights.targetIndustries.join(', ')
      },
      printingRecommendations: {
        techniques: insights.printingTechniques,
        materials: insights.materialRecommendations
      },
      tags: insights.tags
    };
  }
}