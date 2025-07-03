
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">
            Choose the plan that works best for your needs, with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="mt-2 text-3xl font-bold">Free</div>
                <p className="text-muted-foreground text-sm mt-1">For hobbyist creators</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Up to 5 model uploads</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Basic printability check</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Standard licensing options</p>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-lg relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
              Most Popular
            </div>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <div className="mt-2 text-3xl font-bold">₹999<span className="text-base font-normal text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground text-sm mt-1">For professional creators</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Unlimited model uploads</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Advanced printability analysis</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Custom licensing terms</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Priority support</p>
                </li>
              </ul>
              <Button className="w-full">Subscribe Now</Button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="mt-2 text-3xl font-bold">Custom</div>
                <p className="text-muted-foreground text-sm mt-1">For organizations & OEMs</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">All Pro features</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Dedicated account manager</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Custom API integration</p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Advanced analytics</p>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
