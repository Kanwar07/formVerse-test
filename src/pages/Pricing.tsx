
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Brain, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [userType, setUserType] = useState<"creator" | "buyer">("creator");

  const creatorPlans = [
    {
      name: "Free",
      price: annualBilling ? "₹0" : "₹0",
      description: "Basic plan for new creators to get started",
      features: [
        "Upload up to 5 models",
        "Basic FormIQ analysis",
        "Community support",
        "Standard marketplace visibility"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      highlight: false
    },
    {
      name: "Pro",
      price: annualBilling ? "₹499/mo" : "₹699/mo",
      description: "Perfect for growing creators",
      features: [
        "Upload up to 50 models",
        "Full FormIQ analysis & recommendations",
        "Priority customer support",
        "Enhanced marketplace visibility", 
        "Early access to new features",
        "Custom profile branding"
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      highlight: true,
      saveText: annualBilling ? "Save ₹2,400/year" : null
    },
    {
      name: "Enterprise",
      price: annualBilling ? "₹1,999/mo" : "₹2,999/mo",
      description: "For professional CAD designers & studios",
      features: [
        "Unlimited model uploads",
        "Advanced FormIQ analysis with custom AI training",
        "Dedicated account manager",
        "Featured marketplace placement",
        "White-label options",
        "API access",
        "Team collaboration tools"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      highlight: false
    }
  ];

  const buyerPlans = [
    {
      name: "Basic",
      price: "₹0",
      description: "Free access to the marketplace",
      features: [
        "Browse all models",
        "Download up to 3 free models per month",
        "Community support",
        "Basic search functionality"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      highlight: false
    },
    {
      name: "Premium",
      price: annualBilling ? "₹299/mo" : "₹399/mo",
      description: "For enthusiasts and small businesses",
      features: [
        "Unlimited model downloads",
        "Access to premium models",
        "Request custom modifications",
        "Priority customer support",
        "Advanced search filters",
        "Early access to new models"
      ],
      buttonText: "Get Premium",
      buttonVariant: "default" as const,
      highlight: true,
      saveText: annualBilling ? "Save ₹1,200/year" : null
    },
    {
      name: "Business",
      price: annualBilling ? "₹999/mo" : "₹1,299/mo",
      description: "For manufacturing and industrial use",
      features: [
        "Everything in Premium",
        "Commercial license for all downloads",
        "Bulk download options",
        "IP protection guarantee",
        "Custom model requests",
        "Dedicated account manager",
        "API access"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      highlight: false
    }
  ];

  const currentPlans = userType === "creator" ? creatorPlans : buyerPlans;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container py-8 flex-grow pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                Indian Pricing
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Choose the Right Plan</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Affordable plans designed specifically for the Indian market, 
              enabling creators and users to make the most of <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span>.
            </p>
          </div>
          
          {/* Toggle between user types */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-lg">
              <Button 
                onClick={() => setUserType("creator")} 
                variant={userType === "creator" ? "default" : "ghost"}
                className="rounded-md"
              >
                For Creators
              </Button>
              <Button 
                onClick={() => setUserType("buyer")} 
                variant={userType === "buyer" ? "default" : "ghost"}
                className="rounded-md"
              >
                For Buyers
              </Button>
            </div>
          </div>
          
          {/* Billing toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${!annualBilling ? "text-primary" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={annualBilling}
                onCheckedChange={setAnnualBilling}
              />
              <span className={`text-sm font-medium ${annualBilling ? "text-primary" : "text-muted-foreground"}`}>
                Annual (Save up to 30%)
              </span>
            </div>
          </div>
          
          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden ${
                  plan.highlight 
                    ? "border-primary shadow-lg shadow-primary/10" 
                    : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <Badge className="bg-gradient-to-r from-[hsl(var(--formiq-blue))] to-[hsl(var(--formiq-purple))] text-white">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.highlight && <BadgeCheck className="h-5 w-5 text-primary" />}
                  </CardTitle>
                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.name !== "Free" && plan.name !== "Basic" && (
                      <span className="text-muted-foreground ml-1 text-sm">
                        {annualBilling ? "billed annually" : "billed monthly"}
                      </span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {plan.saveText && (
                    <div className="mb-4 p-2 bg-primary/10 text-primary text-sm rounded-md text-center">
                      {plan.saveText}
                    </div>
                  )}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={plan.buttonVariant} className="w-full">
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
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
              <Button variant="outline">Contact Sales</Button>
              <Button>Schedule Demo</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
