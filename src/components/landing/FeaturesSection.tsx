import { Card, CardContent } from "@/components/ui/card";
import pizza from "@/assets/landing/heroSection/pizza.png";
import { Download, Star, User, Eye, Heart } from "lucide-react";
import Button from "../common/Button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { UnifiedCADViewer } from "@/components/preview/UnifiedCADViewer";

// Helper component for individual feature card
function FeatureCard({ model }: { model: any }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [viewerError, setViewerError] = useState(false);
  const profile = model.profiles;

  const getModelFileUrl = () => {
    if (!model.file_path) return "";
    if (model.file_path.startsWith("http")) return model.file_path;
    return `https://zqnzxpbthldfqqbzzjct.supabase.co/storage/v1/object/public/3d-models/${model.file_path}`;
  };

  return (
    <Card
      className={`w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
    >
      <CardContent className="p-2">
        <div className="flex flex-col gap-4 justify-between items-center py-4 px-2 rounded-lg bg-[#000000]">
          <div className="text-white font-medium flex justify-start w-full items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-white/60" />
              )}
            </div>
            @{profile?.username || "creator"}
          </div>
          <div className="w-48 h-48">
            {model.file_path && !viewerError ? (
              <UnifiedCADViewer
                fileUrl={getModelFileUrl()}
                fileName={model.name || "model"}
                fileType={model.file_type}
                width={192}
                height={192}
                showControls={false}
                autoRotate={true}
                className="border-0"
              />
            ) : model.preview_image ? (
              <img
                src={model.preview_image}
                alt={model.name}
                className="w-full h-full object-contain"
                onError={() => setViewerError(true)}
              />
            ) : (
              <img
                src={pizza}
                alt={model.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Card Bottom Section */}
        <div className="flex flex-row justify-between px-2 py-4 items-center">
          <div className="flex flex-col">
            <h3 className="font-semibold text-white">{model.name}</h3>
            <span className="text-gray-400">
              {model.price > 0 ? `$${model.price.toFixed(2)}` : "Free"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Heart
                size={20}
                className={isFavorited ? "fill-red-400 text-red-400" : ""}
              />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturesSection() {
  const { data: models, isLoading } = useQuery({
    queryKey: ["featured-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .select(
          `
          id,
          name,
          description,
          preview_image,
          price,
          downloads,
          view_count,
          user_id,
          file_path,
          file_type,
          tags,
          printability_score
        `
        )
        .eq("status", "published")
        .eq("is_published", true)
        .order("downloads", { ascending: false })
        .limit(4);

      if (error) throw error;

      // Fetch profiles for each model
      const modelsWithProfiles = await Promise.all(
        (data || []).map(async (model) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", model.user_id)
            .single();

          return {
            ...model,
            profiles: profileData || null,
          };
        })
      );

      console.log(modelsWithProfiles);

      return modelsWithProfiles;
    },
  });

  // Fallback cards if models are not loaded
  const fallbackCards = [
    {
      id: "fallback-1",
      name: "Auto-tagging",
      description:
        "AI-powered automatic tagging of your 3D models for better discoverability and enhanced marketplace visibility.",
      preview_image: pizza,
      price: 10000,
      downloads: 0,
      view_count: 0,
      profiles: { username: "creator_name", avatar_url: null },
    },
    {
      id: "fallback-2",
      name: "Printability Check",
      description:
        "Validate your designs with our advanced mesh analysis and receive a comprehensive readiness score.",
      preview_image: pizza,
      price: 12000,
      downloads: 0,
      view_count: 0,
      profiles: { username: "creator_name", avatar_url: null },
    },
    {
      id: "fallback-3",
      name: "Smart Licensing",
      description:
        "Intelligent pricing suggestions and flexible licensing options tailored to your models and market demand.",
      preview_image: pizza,
      price: 8500,
      downloads: 0,
      view_count: 0,
      profiles: { username: "creator_name", avatar_url: null },
    },
    {
      id: "fallback-4",
      name: "Workflow Automation",
      description:
        "Automate repetitive tasks in your 3D design workflow to save time and increase productivity.",
      preview_image: pizza,
      price: 11000,
      downloads: 0,
      view_count: 0,
      profiles: { username: "creator_name", avatar_url: null },
    },
  ];

  const displayModels = models && models.length > 0 ? models : fallbackCards;

  return (
    <section className="relative bg-[#000000] py-16">
      <div className="absolute top-40 -left-32 z-10 subheadingfont">
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

      <div className="absolute bottom-20 -right-32 z-10 subheadingfont">
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
        className="absolute top-0 left-0 h-full w-full z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #051F47, #000000, #000000, #000000, #000000)`,
          filter: "blur(80px)",
        }}
      ></div>

      <div className="mx-20 relative z-20">
        <div className="text-center mb-20">
          <h2 className="text-[30px] font-bold mb-2 headingfont">
            Explore AI Optimized 3D Models
          </h2>
          <p className="text-[16px] font-normal opacity-80 leading-relaxed subheadingfont">
            Find ready-to-use 3D models, optimized by AI for seamless downloads
            and printing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="w-full animate-pulse">
                  <CardContent className="p-2">
                    <div className="flex flex-col gap-4 justify-between items-center py-4 px-2 rounded-lg bg-[#000000]">
                      <div className="text-white font-medium flex justify-start w-full items-center gap-2 px-2">
                        <div className="w-6 h-6 rounded-full bg-white/10" />
                        <div className="h-4 bg-white/10 rounded w-24" />
                      </div>
                      <div className="w-48 h-48 bg-white/10 rounded" />
                    </div>
                    <div className="flex flex-row justify-between px-2 py-4 items-center">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 bg-white/10 rounded w-32" />
                        <div className="h-3 bg-white/10 rounded w-16" />
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 bg-white/10 rounded" />
                        <div className="w-5 h-5 bg-white/10 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : displayModels.map((model) => (
                <FeatureCard key={model.id} model={model} />
              ))}
        </div>
        <div className="rounded-[10px] flex w-full justify-center mt-10">
          <Button onClick={() => {}} className="" style={{}}>
            See more
          </Button>
        </div>
      </div>
    </section>
  );
}
