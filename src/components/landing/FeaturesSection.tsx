import { Card, CardContent } from "@/components/ui/card";
import pizza from "@/assets/landing/heroSection/pizza.png";
import { Download, Star, User } from "lucide-react";
import Button from "../common/Button";

export function FeaturesSection() {
  const cards = [
    {
      title: "Auto-tagging",
      description:
        "AI-powered automatic tagging of your 3D models for better discoverability and enhanced marketplace visibility.",
      icon: (
        <img
          src={pizza}
          alt="Auto-tagging"
          className="w-48 h-48 object-contain"
        />
      ),
      price: "$10,000",
    },
    {
      title: "Printability Check",
      description:
        "Validate your designs with our advanced mesh analysis and receive a comprehensive readiness score.",
      icon: (
        <img
          src={pizza}
          alt="Printability Check"
          className="w-48 h-48 object-contain"
        />
      ),
      price: "$12,000",
    },
    {
      title: "Smart Licensing",
      description:
        "Intelligent pricing suggestions and flexible licensing options tailored to your models and market demand.",
      icon: (
        <img
          src={pizza}
          alt="Smart Licensing"
          className="w-48 h-48 object-contain"
        />
      ),
      price: "$8,500",
    },
    {
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks in your 3D design workflow to save time and increase productivity.",
      icon: (
        <img
          src={pizza}
          alt="Workflow Automation"
          className="w-48 h-48 object-contain"
        />
      ),
      price: "$11,000",
    },
  ];

  return (
    <section className="relative py-16">
      <div className="absolute top-40 -left-32 -z-10 subheadingfont">
        <svg viewBox="0 0 500 320" className="w-full h-64">
          <defs>
            <path
              id="arcText"
              d="M 50 250 A 200 200 0 0 1 450 265"
              fill="transparent"
            />
          </defs>

          {/* Arc stroke */}
          <path
            d="M 50 250 A 200 200 0 0 1 450 250"
            fill="none"
            stroke="#093251"
            strokeWidth="30"
          />

          {/* Scrolling text */}
          <text fontSize="20" fill="#97DBFF">
            <textPath xlinkHref="#arcText" startOffset="0%">
              <animate
                attributeName="startOffset"
                from="-100%"
                to="0%"
                dur="8s"
                repeatCount="indefinite"
              />
              • Over 50,000 downloads • Over 50,000 downloads • Over 50,000
              downloads • Over 50,000 downloads • Over 50,000 downloads • Over
              50,000 downloads • Over 50,000 downloads • Over 50,000 downloads •
              Over 50,000 downloads • Over 50,000 downloads
            </textPath>
          </text>
        </svg>
      </div>

      <div className="absolute bottom-20 -right-32 -z-10 subheadingfont">
        <svg viewBox="0 0 500 320" className="w-full h-64">
          <defs>
            <path
              id="arcTextBottom"
              d="M 50 100 A 200 200 0 0 0 450 110"
              fill="transparent"
            />
          </defs>

          <path
            d="M 50 100 A 200 200 0 0 0 450 100"
            fill="none"
            stroke="#093251"
            strokeWidth="30"
          />

          <text fontSize="20" fill="#97DBFF">
            <textPath xlinkHref="#arcTextBottom" startOffset="0%">
              <animate
                attributeName="startOffset"
                from="-100%"
                to="0%"
                dur="8s"
                repeatCount="indefinite"
              />
              • Over 50,000 downloads • Over 50,000 downloads • Over 50,000
              downloads • Over 50,000 downloads • Over 50,000 downloads • Over
              50,000 downloads • Over 50,000 downloads • Over 50,000 downloads •
              Over 50,000 downloads • Over 50,000 downloads
            </textPath>
          </text>
        </svg>
      </div>

      <div
        className="absolute top-0 left-0 h-full w-full -z-20"
        style={{
          backgroundImage: `
        radial-gradient(circle, #002d6e, #000000, #000000, #000000, #000000)
      `,
          opacity: 0.8,
        }}
      ></div>
      <div className="mx-40">
        <div className="text-center mb-20">
          <h2 className="text-[50px] font-bold mb-2 headingfont">
            Explore AI Optimized 3D Models
          </h2>
          <p className="text-[18px] text-muted-foreground font-light leading-relaxed subheadingfont">
            Find ready-to-use 3D models, optimized by AI for seamless downloads
            and printing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <Card
              key={i}
              className={`w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <CardContent className="p-2">
                <div className="flex flex-col gap-4 justify-between items-center py-4 px-2 rounded-lg bg-[#000000]">
                  <div className="text-white font-medium flex justify-start w-full items-center gap-2 px-2">
                    <User />
                    @creator_name
                  </div>
                  <div>{card.icon}</div>
                </div>

                {/* Card Bottom Section */}
                <div className="flex flex-row justify-between px-2 py-4 items-center">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-white">{card.title}</h3>
                    <span className="text-gray-400">{card.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Star size={20} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-[10px] flex w-full justify-center mt-10">
          <Button>See more</Button>
        </div>
      </div>
    </section>
  );
}
