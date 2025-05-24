
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Brain, Check, ChevronRight } from "lucide-react";

interface PricingFormProps {
  suggestedPrice: number;
  onBack: () => void;
  onContinue: () => void;
}

export const PricingForm = ({ suggestedPrice, onBack, onContinue }: PricingFormProps) => {
  const [actualPrice, setActualPrice] = useState(suggestedPrice);
  const [priceOverridden, setPriceOverridden] = useState(false);

  const handlePriceChange = (value: number[]) => {
    setActualPrice(value[0]);
    setPriceOverridden(value[0] !== suggestedPrice);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <Label>Price (₹)</Label>
            <div className="text-lg font-semibold">₹{actualPrice}</div>
          </div>
          <div className="text-sm">
            {priceOverridden ? (
              <span className="text-muted-foreground flex items-center">
                <Brain className="h-3 w-3 text-primary mr-1" />
                AI suggested: ₹{suggestedPrice}
              </span>
            ) : (
              <span className="flex items-center text-primary">
                <Check className="mr-1 h-4 w-4" />
                AI suggested price
              </span>
            )}
          </div>
        </div>
        
        <div className="py-4">
          <Slider 
            defaultValue={[suggestedPrice]} 
            max={10000} 
            step={100}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>₹500</span>
            <span>₹5,000</span>
            <span>₹10,000</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          <Brain className="h-3 w-3 text-primary mr-1 mt-0.5 inline" />
          FormIQ pricing is based on similar models in our marketplace and considers complexity, 
          detail, and market demand.
        </p>
      </div>
      
      <div>
        <Label>License Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="border rounded-md p-4 cursor-pointer hover:border-primary">
            <h4 className="font-medium">Standard</h4>
            <p className="text-sm text-muted-foreground">Personal and small business use</p>
          </div>
          <div className="border rounded-md p-4 cursor-pointer hover:border-primary bg-primary/5 border-primary">
            <h4 className="font-medium">Commercial</h4>
            <p className="text-sm text-muted-foreground">Unlimited commercial production</p>
            <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary text-xs">AI Recommended</Badge>
          </div>
          <div className="border rounded-md p-4 cursor-pointer hover:border-primary">
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
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onContinue}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
