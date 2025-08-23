export interface LocalizedPrice {
  usdPrice: number;
  localPrice: number;
  currency: string;
  currencySymbol: string;
  adjustmentFactor: number;
  region: string;
}

export interface RegionData {
  currency: string;
  currencySymbol: string;
  purchasingPowerIndex: number; // Relative to USD (1.0 = same as USD)
  exchangeRate: number; // USD to local currency
  marketAdjustment: number; // Additional market-specific adjustment
}

export class LocalizationService {
  // Market data based on purchasing power and local conditions
  private static regionData: Record<string, RegionData> = {
    'IN': {
      currency: 'INR',
      currencySymbol: '₹',
      purchasingPowerIndex: 0.25, // India's purchasing power is roughly 25% of USD
      exchangeRate: 83, // USD to INR (approximate)
      marketAdjustment: 0.8 // Additional adjustment for local market conditions
    },
    'US': {
      currency: 'USD',
      currencySymbol: '$',
      purchasingPowerIndex: 1.0,
      exchangeRate: 1,
      marketAdjustment: 1.0
    },
    'GB': {
      currency: 'GBP',
      currencySymbol: '£',
      purchasingPowerIndex: 0.85,
      exchangeRate: 0.79,
      marketAdjustment: 0.95
    },
    'EU': {
      currency: 'EUR',
      currencySymbol: '€',
      purchasingPowerIndex: 0.9,
      exchangeRate: 0.92,
      marketAdjustment: 0.95
    },
    'CA': {
      currency: 'CAD',
      currencySymbol: 'C$',
      purchasingPowerIndex: 0.8,
      exchangeRate: 1.35,
      marketAdjustment: 0.9
    },
    'AU': {
      currency: 'AUD',
      currencySymbol: 'A$',
      purchasingPowerIndex: 0.85,
      exchangeRate: 1.52,
      marketAdjustment: 0.9
    }
  };

  /**
   * Detect user's region (simplified - would use IP geolocation in production)
   */
  static detectRegion(): string {
    // For now, default to India for the Indian market focus
    // In production, this would use IP geolocation or user preferences
    const userLocale = navigator.language || 'en-IN';
    
    if (userLocale.includes('IN') || userLocale.includes('hi')) return 'IN';
    if (userLocale.includes('US')) return 'US';
    if (userLocale.includes('GB')) return 'GB';
    if (userLocale.includes('CA')) return 'CA';
    if (userLocale.includes('AU')) return 'AU';
    if (userLocale.includes('DE') || userLocale.includes('FR') || userLocale.includes('ES')) return 'EU';
    
    return 'IN'; // Default to India
  }

  /**
   * Localize price based on purchasing power and market conditions
   */
  static localizePrice(usdPrice: number, region?: string): LocalizedPrice {
    const targetRegion = region || this.detectRegion();
    const regionInfo = this.regionData[targetRegion] || this.regionData['IN'];

    // Calculate localized price using purchasing power adjustment
    const purchasingPowerAdjustment = usdPrice * regionInfo.purchasingPowerIndex;
    const marketAdjustedPrice = purchasingPowerAdjustment * regionInfo.marketAdjustment;
    
    // Convert to local currency
    const localCurrencyPrice = marketAdjustedPrice * regionInfo.exchangeRate;
    
    // Round to sensible local currency increments
    const roundedPrice = this.roundToLocalIncrement(localCurrencyPrice, targetRegion);

    return {
      usdPrice,
      localPrice: roundedPrice,
      currency: regionInfo.currency,
      currencySymbol: regionInfo.currencySymbol,
      adjustmentFactor: regionInfo.purchasingPowerIndex * regionInfo.marketAdjustment,
      region: targetRegion
    };
  }

  /**
   * Round prices to sensible increments for each currency
   */
  private static roundToLocalIncrement(price: number, region: string): number {
    switch (region) {
      case 'IN':
        // Round to nearest 10 INR for prices under 1000, nearest 50 for higher
        if (price < 1000) return Math.round(price / 10) * 10;
        return Math.round(price / 50) * 50;
      
      case 'US':
      case 'CA':
      case 'AU':
        // Round to nearest dollar
        return Math.round(price);
      
      case 'GB':
      case 'EU':
        // Round to nearest 0.50
        return Math.round(price * 2) / 2;
      
      default:
        return Math.round(price);
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(localizedPrice: LocalizedPrice): string {
    const { localPrice, currencySymbol, currency } = localizedPrice;
    
    // Format with appropriate decimal places
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'INR' ? 0 : 2,
      maximumFractionDigits: currency === 'INR' ? 0 : 2
    });

    return formatter.format(localPrice).replace(/^[^\d]*/, currencySymbol);
  }

  /**
   * Get pricing explanation for users
   */
  static getPricingExplanation(localizedPrice: LocalizedPrice): string {
    const savingsPercent = Math.round((1 - localizedPrice.adjustmentFactor) * 100);
    
    if (localizedPrice.region === 'IN') {
      return `Price adjusted for Indian market (${savingsPercent}% lower than US pricing)`;
    } else if (localizedPrice.adjustmentFactor < 1) {
      return `Price adjusted for local purchasing power (${savingsPercent}% adjustment)`;
    } else {
      return 'Standard international pricing';
    }
  }

  /**
   * Compare prices across regions
   */
  static compareRegionalPricing(usdPrice: number): LocalizedPrice[] {
    return Object.keys(this.regionData).map(region => 
      this.localizePrice(usdPrice, region)
    );
  }

  /**
   * Get all supported regions
   */
  static getSupportedRegions(): Array<{code: string, name: string, currency: string}> {
    return [
      { code: 'IN', name: 'India', currency: 'INR' },
      { code: 'US', name: 'United States', currency: 'USD' },
      { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
      { code: 'EU', name: 'Europe', currency: 'EUR' },
      { code: 'CA', name: 'Canada', currency: 'CAD' },
      { code: 'AU', name: 'Australia', currency: 'AUD' }
    ];
  }
}