
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Brain, Check, ChevronRight, TrendingUp, Globe, Target, AlertCircle } from "lucide-react";
import { PricingEngine, PricingEngineResult } from "@/services/pricingEngine";
import { LocalizationService } from "@/services/localizationPricing";

interface PricingFormProps {
  suggestedPrice: number;
  modelName: string;
  description?: string;
  printabilityScore?: number;
  onBack: () => void;
  onContinue: (price: number, license: string) => void;
}

export const PricingForm = ({ 
  suggestedPrice, 
  modelName, 
  description = '', 
  printabilityScore = 85, 
  onBack, 
  onContinue 
}: PricingFormProps) => {
  const [actualPrice, setActualPrice] = useState(suggestedPrice);
  const [priceOverridden, setPriceOverridden] = useState(false);
  const [licenseType, setLicenseType] = useState("commercial");
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [pricingAnalysis, setPricingAnalysis] = useState<PricingEngineResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Load comprehensive pricing analysis
  useEffect(() => {
    const loadPricingAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const analysis = await PricingEngine.generatePricingAnalysis(
          modelName,
          description,
          printabilityScore
        );
        setPricingAnalysis(analysis);
        
        // Update suggested price with final recommendation
        const recommendedPrice = analysis.localizedPrice.localPrice;
        setActualPrice(recommendedPrice);
      } catch (error) {
        console.error('Error loading pricing analysis:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    loadPricingAnalysis();
  }, [modelName, description, printabilityScore]);

  const handlePriceChange = (value: number[]) => {
    const newPrice = value[0];
    setActualPrice(newPrice);
    setPriceOverridden(pricingAnalysis ? newPrice !== pricingAnalysis.localizedPrice.localPrice : false);
  };

  const handleLicenseSelect = (license: string) => {
    setLicenseType(license);
  };

  const handleSubmit = () => {
    onContinue(actualPrice, licenseType);
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Brain className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Market Pricing</h3>
          <p className="text-muted-foreground">
            FormIQ is analyzing competitor prices and generating optimal pricing recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (!pricingAnalysis) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Pricing Analysis</h3>
          <p className="text-muted-foreground">
            Using basic pricing. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const currencySymbol = pricingAnalysis.localizedPrice.currencySymbol;
  const recommendedPrice = pricingAnalysis.localizedPrice.localPrice;

  return (
    <div className="space-y-6">
      {/* 3-Column Pricing Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-primary mr-2" />
          Market Pricing Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Competitor Benchmark */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                Competitor Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground mb-1">
                {pricingAnalysis.competitorBenchmark.summary}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {pricingAnalysis.competitorBenchmark.details.slice(0, 3).map((detail, i) => (
                  <div key={i}>{detail}</div>
                ))}
              </div>
              <Badge variant="outline" className="mt-2 text-xs">
                {pricingAnalysis.competitorBenchmark.analysis.competitiveness}% competitive
              </Badge>
            </CardContent>
          </Card>

          {/* FormIQ Suggestion */}
          <Card className="border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Brain className="h-4 w-4 text-primary mr-2" />
                FormIQ Suggested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-1">
                ${pricingAnalysis.formiqSuggestion.price}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {pricingAnalysis.formiqSuggestion.rationale.slice(0, 2).map((reason, i) => (
                  <div key={i}>• {reason}</div>
                ))}
              </div>
              <Badge className="mt-2 text-xs">
                {pricingAnalysis.formiqSuggestion.confidenceScore}% confidence
              </Badge>
            </CardContent>
          </Card>

          {/* Localized Price */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Globe className="h-4 w-4 text-green-600 mr-2" />
                Localized Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 mb-1">
                {LocalizationService.formatPrice(pricingAnalysis.localizedPrice)}
              </div>
              <div className="text-xs text-muted-foreground">
                {LocalizationService.getPricingExplanation(pricingAnalysis.localizedPrice)}
              </div>
              <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700">
                {pricingAnalysis.recommendations.pricingStrategy}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {pricingAnalysis.recommendations.adjustmentReasons.length > 0 && (
          <Card className="bg-blue-50/30 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-sm mb-2 text-blue-900">Pricing Recommendations:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                {pricingAnalysis.recommendations.adjustmentReasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Price Adjustment */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <Label>Final Price ({pricingAnalysis.localizedPrice.currency})</Label>
            <div className="text-lg font-semibold">
              {LocalizationService.formatPrice({ ...pricingAnalysis.localizedPrice, localPrice: actualPrice })}
            </div>
          </div>
          <div className="text-sm">
            {priceOverridden ? (
              <span className="text-muted-foreground flex items-center">
                <Brain className="h-3 w-3 text-primary mr-1" />
                AI suggested: {LocalizationService.formatPrice(pricingAnalysis.localizedPrice)}
              </span>
            ) : (
              <span className="flex items-center text-primary">
                <Check className="mr-1 h-4 w-4" />
                AI optimized price
              </span>
            )}
          </div>
        </div>
        
        <div className="py-4">
          <Slider 
            value={[actualPrice]}
            max={Math.max(recommendedPrice * 2, 10000)} 
            step={pricingAnalysis.localizedPrice.currency === 'INR' ? 10 : 1}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{currencySymbol}{Math.round(recommendedPrice * 0.5)}</span>
            <span>{currencySymbol}{recommendedPrice}</span>
            <span>{currencySymbol}{Math.round(recommendedPrice * 1.5)}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          <Brain className="h-3 w-3 text-primary mr-1 mt-0.5 inline" />
          Pricing based on market analysis, model complexity, printability score, and regional purchasing power.
        </p>
      </div>
      
      <div>
        <Label>License Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div 
            className={`border rounded-md p-4 cursor-pointer hover:border-primary transition-all ${licenseType === 'standard' ? 'bg-primary/5 border-primary' : ''}`}
            onClick={() => handleLicenseSelect('standard')}
          >
            <h4 className="font-medium">Standard</h4>
            <p className="text-sm text-muted-foreground">Personal and small business use</p>
          </div>
          <div 
            className={`border rounded-md p-4 cursor-pointer hover:border-primary transition-all ${licenseType === 'commercial' ? 'bg-primary/5 border-primary' : ''}`}
            onClick={() => handleLicenseSelect('commercial')}
          >
            <h4 className="font-medium">Commercial</h4>
            <p className="text-sm text-muted-foreground">Unlimited commercial production</p>
            <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary text-xs">AI Recommended</Badge>
          </div>
          <div 
            className={`border rounded-md p-4 cursor-pointer hover:border-primary transition-all ${licenseType === 'extended' ? 'bg-primary/5 border-primary' : ''}`}
            onClick={() => handleLicenseSelect('extended')}
          >
            <h4 className="font-medium">Extended</h4>
            <p className="text-sm text-muted-foreground">Includes source files & modifications</p>
          </div>
        </div>
      </div>
      
      <div>
        <Label>Additional License Terms</Label>
        <Textarea 
          placeholder="Any additional license terms or restrictions..."
          className="mt-2 min-h-[80px]"
          value={additionalTerms}
          onChange={(e) => setAdditionalTerms(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
