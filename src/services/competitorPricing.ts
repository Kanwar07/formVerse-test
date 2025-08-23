export interface CompetitorPrice {
  platform: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  currency: string;
  priceRange: string;
}

export interface CompetitorBenchmark {
  category: string;
  competitors: CompetitorPrice[];
  overallRange: {
    min: number;
    max: number;
    average: number;
  };
}

export class CompetitorPricingService {
  // Static competitor data based on market research
  private static competitorData: Record<string, CompetitorBenchmark> = {
    automotive: {
      category: 'Automotive Components',
      competitors: [
        { platform: 'GrabCAD', minPrice: 0, maxPrice: 0, avgPrice: 0, currency: 'USD', priceRange: 'Free' },
        { platform: 'CGTrader', minPrice: 15, maxPrice: 50, avgPrice: 32, currency: 'USD', priceRange: '$15-$50' },
        { platform: 'TurboSquid', minPrice: 40, maxPrice: 120, avgPrice: 80, currency: 'USD', priceRange: '$40-$120' },
        { platform: 'Fiverr (CAD)', minPrice: 25, maxPrice: 100, avgPrice: 62, currency: 'USD', priceRange: '$25-$100/model' }
      ],
      overallRange: { min: 0, max: 120, average: 44 }
    },
    mechanical: {
      category: 'Mechanical Parts',
      competitors: [
        { platform: 'GrabCAD', minPrice: 0, maxPrice: 0, avgPrice: 0, currency: 'USD', priceRange: 'Free' },
        { platform: 'CGTrader', minPrice: 10, maxPrice: 35, avgPrice: 22, currency: 'USD', priceRange: '$10-$35' },
        { platform: 'TurboSquid', minPrice: 25, maxPrice: 80, avgPrice: 52, currency: 'USD', priceRange: '$25-$80' },
        { platform: 'Upwork (CAD)', minPrice: 20, maxPrice: 75, avgPrice: 47, currency: 'USD', priceRange: '$20-$75/model' }
      ],
      overallRange: { min: 0, max: 80, average: 30 }
    },
    architecture: {
      category: 'Architectural Elements',
      competitors: [
        { platform: 'GrabCAD', minPrice: 0, maxPrice: 0, avgPrice: 0, currency: 'USD', priceRange: 'Free' },
        { platform: 'CGTrader', minPrice: 20, maxPrice: 60, avgPrice: 40, currency: 'USD', priceRange: '$20-$60' },
        { platform: 'TurboSquid', minPrice: 30, maxPrice: 150, avgPrice: 90, currency: 'USD', priceRange: '$30-$150' },
        { platform: 'Fiverr (Arch)', minPrice: 30, maxPrice: 120, avgPrice: 75, currency: 'USD', priceRange: '$30-$120/model' }
      ],
      overallRange: { min: 0, max: 150, average: 51 }
    },
    medical: {
      category: 'Medical Devices',
      competitors: [
        { platform: 'CGTrader', minPrice: 25, maxPrice: 80, avgPrice: 52, currency: 'USD', priceRange: '$25-$80' },
        { platform: 'TurboSquid', minPrice: 45, maxPrice: 200, avgPrice: 122, currency: 'USD', priceRange: '$45-$200' },
        { platform: 'Upwork (Medical)', minPrice: 40, maxPrice: 150, avgPrice: 95, currency: 'USD', priceRange: '$40-$150/model' }
      ],
      overallRange: { min: 25, max: 200, average: 90 }
    },
    consumer: {
      category: 'Consumer Products',
      competitors: [
        { platform: 'GrabCAD', minPrice: 0, maxPrice: 0, avgPrice: 0, currency: 'USD', priceRange: 'Free' },
        { platform: 'CGTrader', minPrice: 8, maxPrice: 25, avgPrice: 16, currency: 'USD', priceRange: '$8-$25' },
        { platform: 'TurboSquid', minPrice: 15, maxPrice: 60, avgPrice: 37, currency: 'USD', priceRange: '$15-$60' },
        { platform: 'Fiverr (Product)', minPrice: 15, maxPrice: 50, avgPrice: 32, currency: 'USD', priceRange: '$15-$50/model' }
      ],
      overallRange: { min: 0, max: 60, average: 21 }
    },
    general: {
      category: 'General CAD Models',
      competitors: [
        { platform: 'GrabCAD', minPrice: 0, maxPrice: 0, avgPrice: 0, currency: 'USD', priceRange: 'Free' },
        { platform: 'CGTrader', minPrice: 12, maxPrice: 45, avgPrice: 28, currency: 'USD', priceRange: '$12-$45' },
        { platform: 'TurboSquid', minPrice: 20, maxPrice: 100, avgPrice: 60, currency: 'USD', priceRange: '$20-$100' },
        { platform: 'Freelance Avg', minPrice: 25, maxPrice: 80, avgPrice: 52, currency: 'USD', priceRange: '$25-$80/model' }
      ],
      overallRange: { min: 0, max: 100, average: 35 }
    }
  };

  /**
   * Get competitor benchmark for a specific category
   */
  static getCompetitorBenchmark(categories: string[]): CompetitorBenchmark {
    // Find the most relevant category
    const relevantCategory = this.findRelevantCategory(categories);
    return this.competitorData[relevantCategory] || this.competitorData.general;
  }

  /**
   * Find the most relevant category based on model tags/industries
   */
  private static findRelevantCategory(categories: string[]): string {
    const categoryMap: Record<string, string[]> = {
      automotive: ['automotive', 'vehicle', 'car', 'engine', 'transportation'],
      mechanical: ['mechanical', 'gear', 'tool', 'engineering', 'industrial'],
      architecture: ['architecture', 'building', 'construction', 'structural'],
      medical: ['medical', 'healthcare', 'prosthetic', 'device'],
      consumer: ['toy', 'consumer', 'entertainment', 'household', 'jewelry']
    };

    const lowerCategories = categories.map(c => c.toLowerCase());
    
    for (const [key, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowerCategories.some(cat => cat.includes(keyword)))) {
        return key;
      }
    }
    
    return 'general';
  }

  /**
   * Format competitor data for UI display
   */
  static formatForDisplay(benchmark: CompetitorBenchmark): {
    summary: string;
    details: string[];
    averagePrice: number;
  } {
    const paidCompetitors = benchmark.competitors.filter(c => c.avgPrice > 0);
    const freeCount = benchmark.competitors.length - paidCompetitors.length;
    
    return {
      summary: `$${benchmark.overallRange.min}–$${benchmark.overallRange.max}`,
      details: benchmark.competitors.map(c => `${c.platform}: ${c.priceRange}`),
      averagePrice: benchmark.overallRange.average
    };
  }

  /**
   * Analyze pricing competitiveness
   */
  static analyzePricingPosition(suggestedPrice: number, benchmark: CompetitorBenchmark): {
    position: 'below' | 'competitive' | 'premium';
    message: string;
    competitiveness: number; // 0-100 score
  } {
    const avgPrice = benchmark.overallRange.average;
    const minPrice = benchmark.overallRange.min;
    const maxPrice = benchmark.overallRange.max;

    if (suggestedPrice < avgPrice * 0.8) {
      return {
        position: 'below',
        message: 'Priced below market average - consider increasing for better perceived value',
        competitiveness: Math.max(0, (suggestedPrice / avgPrice) * 100)
      };
    } else if (suggestedPrice > avgPrice * 1.3) {
      return {
        position: 'premium',
        message: 'Premium pricing - ensure model quality justifies the higher price',
        competitiveness: Math.min(100, ((maxPrice - suggestedPrice) / (maxPrice - avgPrice)) * 100)
      };
    } else {
      return {
        position: 'competitive',
        message: 'Competitively priced within market range',
        competitiveness: 85
      };
    }
  }
}