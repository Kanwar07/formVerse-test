import Button from "../common/Button";
import CreatorCard from "./components/CreatorCard";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

interface Creator {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  models_count: number;
  total_downloads: number;
  avg_rating: number;
  model_previews: string[];
}

export function CreatorLeaderboardSection() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    fetchTopCreators();
  }, []);

  const fetchTopCreators = async () => {
    try {
      const { data: models, error: modelsError } = await supabase
        .from("models")
        .select("user_id, preview_image, downloads, printability_score")
        .eq("status", "published")
        .eq("is_published", true);

      if (modelsError) throw modelsError;

      if (!models || models.length === 0) {
        setCreators([]);
        setLoading(false);
        return;
      }

      // Group by creator and collect unique user IDs
      const creatorMap = new Map();
      const userIds = new Set<string>();

      models.forEach((model) => {
        const userId = model.user_id;
        userIds.add(userId);

        if (!creatorMap.has(userId)) {
          creatorMap.set(userId, {
            id: userId,
            models: [],
            totalDownloads: 0,
          });
        }

        const creator = creatorMap.get(userId);
        creator.models.push({
          preview_image: model.preview_image,
          downloads: model.downloads || 0,
          printability_score: model.printability_score || 0,
        });
        creator.totalDownloads += model.downloads || 0;
      });

      // Fetch profile data for all user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, bio")
        .in("id", Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a profile map for quick lookup
      const profileMap = new Map();
      profiles?.forEach((profile) => {
        profileMap.set(profile.id, profile);
      });

      // Combine model data with profile data
      const creatorsArray = Array.from(creatorMap.entries())
        .map(([userId, creatorData]) => {
          const profile = profileMap.get(userId);
          const avgRating =
            creatorData.models.length > 0
              ? creatorData.models.reduce(
                  (sum: number, m: any) => sum + (m.printability_score || 0),
                  0
                ) /
                creatorData.models.length /
                20
              : 0;

          return {
            id: userId,
            username: profile?.username || "Anonymous",
            avatar_url: profile?.avatar_url || null,
            bio:
              profile?.bio ||
              "CAD designer specializing in 3D modeling and product design",
            models_count: creatorData.models.length,
            total_downloads: creatorData.totalDownloads,
            avg_rating: Math.round(avgRating * 10) / 10,
            model_previews: creatorData.models
              .slice(0, 4)
              .map((m: any) => m.preview_image)
              .filter(Boolean),
          };
        })
        .sort((a, b) => {
          // Sort by model count first, then by downloads
          if (b.models_count !== a.models_count) {
            return b.models_count - a.models_count;
          }
          return b.total_downloads - a.total_downloads;
        })
        .slice(0, 3);

      console.log(creatorsArray);

      setCreators(creatorsArray);
    } catch (error) {
      console.error("Error fetching creators:", error);
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="pb-10 z-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-[30px] font-bold mb-4 headingfont">
            Our CAD Creators
          </h2>
          <p className="font-normal opacity-80 text-[16px] subheadingfont">
            Empower anyone to create production-ready 3D assets from a <br />
            simple text prompt or reference images in seconds
          </p>
        </div>

        <div className="relative flex flex-row justify-center gap-8 z-10">
          <div
            className="absolute inset-0 -top-60 flex justify-center items-center -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #8853FA80 0%, transparent 75%)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "800px 600px",
              filter: "blur(140px)",
            }}
          ></div>
          {loading ? (
            // Loading state
            <div className="flex flex-row gap-8">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`bg-[#191919] rounded-3xl w-[340px] h-[500px] animate-pulse ${
                    index === 1 ? "z-10 -translate-y-8" : "z-0"
                  }`}
                />
              ))}
            </div>
          ) : creators.length > 0 ? (
            // Podium layout: Left (3rd), Center (1st - highest), Right (2nd)
            <>
              {/* Third place - Left */}
              {creators[2] && (
                <div className="flex flex-col items-center">
                  <CreatorCard creator={creators[2]} rank={2} className="z-0" />
                </div>
              )}

              {/* First place - Center (highest model count) */}
              {creators[0] && (
                <div className="flex flex-col items-center">
                  <CreatorCard
                    creator={creators[0]}
                    rank={0}
                    className="z-10 -translate-y-8"
                  />
                </div>
              )}

              {/* Second place - Right */}
              {creators[1] && (
                <div className="flex flex-col items-center">
                  <CreatorCard creator={creators[1]} rank={1} className="z-0" />
                </div>
              )}
            </>
          ) : (
            // No creators found
            <div className="text-center py-12">
              <p className="text-[hsl(var(--text-secondary))]">
                No creators found
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Link to="/creators">
            <Button onClick={() => {}}>View All Creators</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
