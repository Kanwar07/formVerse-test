
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Brain, Check, Zap, Users, Building2, Globe, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import pricingData from "@/data/pricing.json";

const Pricing = () => {
  const [isIndiaRegion, setIsIndiaRegion] = useState(true);
  const [activeTab, setActiveTab] = useState("image-to-cad");

  const { image_to_cad, marketplace } = pricingData.pricing;

  const formatPrice = (inrPrice: number | string, usdPrice: number | string) => {
    if (typeof inrPrice === 'string') return inrPrice;
    return isIndiaRegion 
      ? `₹${inrPrice.toLocaleString()}` 
      : `$${usdPrice}`;
  };

  const formatCreditsPerDollar = (credits: number | string, price: number | string) => {
    if (typeof credits === 'string' || typeof price === 'string') return 'Custom';
    const numPrice = isIndiaRegion ? (price as number) : (price as number);
    const creditsPerUnit = (credits as number) / (numPrice as number);
    return isIndiaRegion 
      ? `${creditsPerUnit.toFixed(1)} credits/₹`
      : `${creditsPerUnit.toFixed(1)} credits/$`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container py-8 flex-grow pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {isIndiaRegion ? 'India Pricing' : 'Global Pricing'}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Flexible Pricing for Every Creator</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Credit-based pricing for Image-to-CAD generation and fair marketplace fees. 
              Choose what works best for your <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> journey.
            </p>
          </div>
          
          {/* Region Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-lg">
              <Button 
                onClick={() => setIsIndiaRegion(true)} 
                variant={isIndiaRegion ? "default" : "ghost"}
                className="rounded-md flex items-center gap-2"
              >
                🇮🇳 India
              </Button>
              <Button 
                onClick={() => setIsIndiaRegion(false)} 
                variant={!isIndiaRegion ? "default" : "ghost"}
                className="rounded-md flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Global
              </Button>
            </div>
          </div>
          
          {/* Service Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="image-to-cad" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Image-to-CAD
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Marketplace
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="image-to-cad" className="space-y-8">
              {/* Credit Costs */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-primary mr-2" />
                  Credit Usage & Costs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(image_to_cad.credit_costs).map(([type, cost]) => (
                    <div key={type} className="text-center p-4 bg-background rounded-md">
                      <div className="text-2xl font-bold text-primary">{cost}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {type.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {image_to_cad.plans.map((plan, index) => (
                  <Card 
                    key={plan.name}
                    className={`relative ${index === 2 ? 'border-primary shadow-lg' : ''}`}
                  >
                    {index === 2 && (
                      <div className="absolute top-0 right-0 -mt-2 -mr-2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="text-2xl font-bold">
                        {formatPrice(plan.india_price_inr, plan.global_price_usd)}
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.target}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Credits</span>
                        <Badge variant="secondary">{plan.credits}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Value</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCreditsPerDollar(plan.credits, isIndiaRegion ? plan.india_price_inr : plan.global_price_usd)}
                        </span>
                      </div>
                      {typeof plan.overage !== 'string' && (
                        <div className="text-xs text-muted-foreground">
                          Overage: {isIndiaRegion 
                            ? `₹${plan.overage.inr_per_credit}/credit` 
                            : `$${plan.overage.usd_per_credit}/credit`
                          }
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={index === 2 ? "default" : "outline"} 
                        className="w-full"
                        asChild
                      >
                        {plan.name === 'Enterprise' ? (
                          <a href="mailto:formversedude@gmail.com?subject=Enterprise Plan Inquiry">Contact Sales</a>
                        ) : (
                          <span>Get Started</span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Policies */}
              <div className="bg-blue-50/30 border border-blue-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Rollover Policy:</span> {image_to_cad.rollover_policy}
                  </div>
                  <div>
                    <span className="font-medium">API Access:</span> {image_to_cad.api_access}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Designers/Creators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      For Designers & Creators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {marketplace.designers.base_share_percent}%
                      </div>
                      <div className="text-sm text-muted-foreground">Base revenue share</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Exclusive content</span>
                        <Badge variant="secondary">{marketplace.designers.exclusive_share_percent}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Top performers</span>
                        <Badge variant="secondary">{marketplace.designers.max_share_percent}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payout schedule</span>
                        <span className="text-sm text-muted-foreground">{marketplace.designers.payout_schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Listing fee</span>
                        <span className="text-sm text-green-600">₹{marketplace.designers.listing_fee}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Minimum Pricing</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(marketplace.designers.price_floors).map(([type, price]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                            <span>{isIndiaRegion ? `₹${price.india_inr}` : `$${price.global_usd}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Buyers/Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      For Buyers & Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {isIndiaRegion 
                          ? `${marketplace.users.buyer_fees.india}%` 
                          : `${marketplace.users.buyer_fees.global}%`
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Buyer fees</div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      {marketplace.users.subscriptions.map((sub) => (
                        <Card key={sub.name} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{sub.name}</h4>
                            <div className="text-lg font-bold">
                              {formatPrice(sub.india_price_inr, sub.global_price_usd)}/mo
                            </div>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {sub.perks.map((perk, i) => (
                              <li key={i} className="flex items-start">
                                <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5 shrink-0" />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* FormIQ highlight */}
          <div className="mt-16 bg-gradient-to-r from-[hsl(var(--formiq-blue)/10)] to-[hsl(var(--formiq-purple)/10)] rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">FormIQ Premium Features</h3>
                <p className="text-muted-foreground mb-4">
                  Our Pro and Enterprise plans include advanced FormIQ AI features that significantly 
                  improve model quality, discoverability, and monetization opportunities.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/formiq">Learn More About FormIQ</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Can I change plans later?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. 
                  Changes to your subscription will take effect on your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit/debit cards, UPI, net banking, and wallets 
                  including PayTM, PhonePe, and Google Pay.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a refund policy?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied,
                  contact our support team within 7 days of payment.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Do you offer discounts for students?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we offer a 40% discount for verified students and educators. 
                  Contact our support team with valid ID proof to apply.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact section */}
          <div className="mt-16 text-center">
            <h2 className="text-xl font-medium mb-2">Need help choosing the right plan?</h2>
            <p className="text-muted-foreground mb-4">
              Our team is ready to help you find the perfect solution for your needs.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:formversedude@gmail.com?subject=Sales Inquiry">Contact Sales</a>
              </Button>
              <Button asChild>
                <a href="mailto:formversedude@gmail.com?subject=Demo Request">Schedule Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
