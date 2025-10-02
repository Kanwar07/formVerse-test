import { Check } from "lucide-react";
import Button from "../common/Button";

export default function PricingSection() {
  const plans = [
    {
      name: "FREE",
      badge: "3 Months",
      price: null,
      subtitle: "Limited time offer for FIRST 1000 SUBSCRIBERS",
      users: "Solo Creators",
      credits: "+60",
      creditPrice: "₹9/Credit",
      features: [
        "Generate up to 50 models/month",
        "Or 13 multi-view generations",
      ],
      buttonText: "Subscribe",
      isPopular: false,
      isFree: true,
    },
    {
      name: "Starter",
      badge: null,
      price: "₹1,499",
      subtitle: null,
      users: "Solo Creators",
      credits: "+60",
      creditPrice: "₹9/Credit",
      features: [
        "Generate up to 25 single-view models",
        "Or 13 multi-view generations",
        "2-month credit rollover",
        "Priority processing",
      ],
      buttonText: "Subscribe",
      isPopular: false,
      isFree: false,
    },
    {
      name: "Indie",
      badge: "Most Popular",
      price: "₹1,499",
      subtitle: null,
      users: "Solo Creators",
      credits: "+60",
      creditPrice: "₹9/Credit",
      features: [
        "Generate up to 25 single-view models",
        "Or 13 multi-view generations",
        "2-month credit rollover",
        "Priority processing",
      ],
      buttonText: "Subscribe",
      isPopular: true,
      isFree: false,
    },
    {
      name: "Pro",
      badge: null,
      price: "₹1,499",
      subtitle: null,
      users: "Solo Creators",
      credits: "+60",
      creditPrice: "₹9/Credit",
      features: [
        "Generate up to 25 single-view models",
        "Or 13 multi-view generations",
        "2-month credit rollover",
        "Priority processing",
      ],
      buttonText: "Subscribe",
      isPopular: false,
      isFree: false,
    },
  ];

  return (
    <div className="relative bg-[#000000] overflow-hidden rounded-b-[80px] px-40 py-20">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 flex justify-center items-center z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #8853FA66 0%, transparent 80%)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 300px",
            backgroundSize: "300px 300px",
          }}
        ></div>

        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, #051428 0%, #0B111B00 80%, #0B111B00 100%)",
          }}
        ></div>
      </div>

      <div className="relative z-40 py-12 px-4 container mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the plan that fits your needs and start creating amazing 3D
            prints instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.isPopular
                  ? "bg-gradient-to-b from-blue-600/20 to-purple-600/20 border border-blue-500/50"
                  : "bg-gray-800/50 border border-gray-700"
              }`}
              style={
                plan.isFree
                  ? {
                      borderRadius: "12px",
                      border: "2px solid",
                      borderImage:
                        "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa) 1",
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.badge && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      plan.isPopular
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              {plan.isFree && (
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-6 flex rounded-full bg-blue-500 items-center justify-center">
                      <span className="text-white text-xs font-bold">%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-sm">
                        {plan.subtitle}
                      </span>
                      <span className="text-gray-300 text-sm mb-2">
                        {plan.users}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {plan.price && (
                <>
                  <div className="text-3xl font-bold text-white mb-1">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-400">
                      {" "}
                      /month{" "}
                    </span>
                  </div>
                  {plan.subtitle && (
                    <div className="text-gray-400 text-sm">{plan.subtitle}</div>
                  )}
                  <div className="text-gray-400 text-sm mb-4">{plan.users}</div>
                </>
              )}

              <div className="mb-6">
                <div
                  className={`rounded-lg p-4 ${
                    plan.isPopular ? "bg-gray-800/50" : "bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">
                        Credits Included
                      </div>
                      <div className="text-gray-400 text-sm">
                        {plan.creditPrice}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {plan.credits}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div className="mb-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full flex justify-center">
                  <Button>{plan.buttonText}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
