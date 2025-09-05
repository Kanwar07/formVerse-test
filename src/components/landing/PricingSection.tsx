
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import pricingData from "@/data/pricing.json";

export function PricingSection() {
  const { image_to_cad } = pricingData.pricing;

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Credit-Based Pricing
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Image-to-CAD Generation Plans</h2>
          <p className="text-muted-foreground">
            Pay only for what you use with our flexible credit system. Perfect for creators of all sizes.
          </p>
        </div>

        {/* Credit Usage Info */}
        <div className="bg-muted/30 rounded-lg p-6 mb-12 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            Credit Usage per Generation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(image_to_cad.credit_costs).map(([type, cost]) => (
              <div key={type} className="text-center p-3 bg-background rounded-md">
                <div className="text-xl font-bold text-primary">{cost}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {type.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {image_to_cad.plans.slice(0, 3).map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`border shadow-sm ${index === 1 ? 'border-primary shadow-lg relative' : ''}`}
            >
              {index === 1 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-2 text-3xl font-bold">
                    ₹{typeof plan.india_price_inr === 'number' 
                      ? plan.india_price_inr.toLocaleString() 
                      : plan.india_price_inr}
                    {typeof plan.india_price_inr === 'number' && (
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{plan.target}</p>
                </div>
                
                <div className="mb-4 p-3 bg-primary/5 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Credits Included</span>
                    <Badge variant="secondary" className="font-bold">{plan.credits}</Badge>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Generate up to {Math.floor(Number(plan.credits) / 8)} single-view models</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">Or {Math.floor(Number(plan.credits) / 15)} multi-view generations</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <p className="text-sm">2-month credit rollover</p>
                  </li>
                  {index > 0 && (
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p className="text-sm">Priority processing</p>
                    </li>
                  )}
                  {index > 1 && (
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <p className="text-sm">API access included</p>
                    </li>
                  )}
                </ul>

                {typeof plan.overage !== 'string' && (
                  <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted/30 rounded">
                    Overage: ₹{plan.overage.inr_per_credit}/credit
                  </div>
                )}

                <Button 
                  variant={index === 1 ? "default" : "outline"} 
                  className="w-full"
                  asChild
                >
                  {plan.name === 'Enterprise' ? (
                    <a href="mailto:formversedude@gmail.com?subject=Enterprise Plan Inquiry">Contact Sales</a>
                  ) : (
                    <span>Get Started</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
