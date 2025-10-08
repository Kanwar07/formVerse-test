import { Calendar, CalendarHeart, Check, Tag } from "lucide-react";
import Button from "../common/Button";

export default function PricingSection() {
  const plans = [
    {
      name: "FREE",
      badge: "3 Months",
      price: null,
      subtitle: "FIRST 1000 SUBSCRIBERS",
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
    <div className="relative overflow-hidden rounded-b-[80px] px-20 pb-20 z-30">
      <div className="absolute inset-0">
        <div
          className="absolute -top-32 inset-0 flex justify-center items-center"
          style={{
            backgroundImage:
              "radial-gradient(circle, #8853FA80 0%, transparent 75%)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 225px",
            backgroundSize: "450px 600px",
            filter: "blur(20px)",
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

      <div className="relative py-12 px-4 container mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-[30px] headingfont font-bold mb-4">
            We have got a plan for you
          </h2>
          <p className="font-normal text-[16px] subheadingfont opacity-80">
            Formverse is free to use. Upgrade to a plan that fits your needs{" "}
            <br /> for additional benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 subheadingfont">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative ${
                plan.isFree ? "bg-transparent" : "bg-[#121A1E]"
              } backdrop-blur-[108.62px] rounded-[16px] pb-4 flex flex-col`}
            >
              {plan.isPopular && (
                <div
                  className="absolute -top-60 -right-40 inset-0 flex justify-center items-center z-10 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #0997F6, transparent 75%)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center 225px",
                    backgroundSize: "250px 250px",
                    filter: "blur(60px)",
                  }}
                ></div>
              )}

              {plan.isFree && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "2px",
                    background:
                      "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                    borderRadius: "25px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              )}
              <div className="flex items-center justify-between py-4 px-6 bg-black/20 backdrop-blur-[108.62px] rounded-t-[16px]">
                <h3 className="text-[17.5px] font-bold text-[#D9D9D9]">
                  {plan.name}
                </h3>
                {plan.badge &&
                  (plan.isFree ? (
                    <div className="px-3 py-1 flex flex-row gap-2 rounded-full text-[14px] text-[#9D9D9D]/60 font-extrabold flex items-center gap-1">
                      <Calendar size={18} /> {plan.badge}
                    </div>
                  ) : (
                    <span className="relative z-20 inline-block px-3 py-1 rounded-full text-sm font-medium text-white">
                      <span
                        className="absolute inset-0 rounded-[8px] border-[1px] border-transparent bg-gradient-to-r from-[#1489D4] via-[#0E2533] to-[#01558C] p-[1px]"
                        style={{
                          WebkitMask:
                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      ></span>
                      <span className="relative z-10 px-2 py-1 text-[14px] font-extrabold bg-gradient-to-r from-[#1489D4] to-[#87C9F2] bg-clip-text text-transparent">
                        {plan.badge}
                      </span>
                    </span>
                  ))}
              </div>

              <div className="pt-3 px-6">
                {plan.isFree && (
                  <div className="flex items-start gap-4 mt-7">
                    <div className="mt-2">
                      <Tag size={28} />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-col mb-3">
                        <span className="text-[13px] font-medium">
                          Limited time offer for{" "}
                        </span>
                        <span className="text-[14px] font-extrabold bg-gradient-to-r from-[#97DBFF] to-[#C2A6FF] bg-clip-text text-transparent opacity-60">
                          {plan.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {plan.price && (
                  <>
                    <div className="text-[30px] font-normal text-[#B1B8BD] mt-3">
                      {plan.price}
                      <span className="text-[20px] font-light text-[#758690]">
                        {" "}
                        /month{" "}
                      </span>
                    </div>
                    {plan.subtitle && (
                      <div className="text-gray-400 text-sm">
                        {plan.subtitle}
                      </div>
                    )}
                    <div className="text-[#627079] text-[16px] font-light">
                      {plan.users}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-lg p-4 mx-4 my-6 flex items-center justify-between border-2 border-[#D9D9D9]/20 rounded-[8.75px]">
                <div>
                  <div className="text-white text-[15.5px] font-normal">
                    Credits Included
                  </div>
                  <div className="text-[#8A97A0] text-[12px] font-normal">
                    {plan.creditPrice}
                  </div>
                </div>
                <div className="text-[15.5px] font-extrabold text-white bg-[#595C5D]/20 py-2 px-3 rounded-[7.78px]">
                  {plan.credits}
                </div>
              </div>

              <div className="flex flex-col justify-between flex-1 px-6">
                <div className="mb-4 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[#838C93] text-[12px]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full my-4 flex justify-center">
                  <Button className={`px-16 py-2`}>{plan.buttonText}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
