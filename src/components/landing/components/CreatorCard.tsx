import crystalImage from "@/assets/landing/creatorSection/crystal-model.jpg";
import characterImage from "@/assets/landing/creatorSection/character-model.jpg";
import dragonImage from "@/assets/landing/creatorSection/dragon-model.jpg";
import pizzaImage from "@/assets/landing/creatorSection/pizza-model.jpg";
import { User } from "lucide-react";

interface CreatorCardProps {
  className?: string;
  creator?: {
    username: string;
    avatar_url: string | null;
    bio: string | null;
    models_count: number;
    total_downloads: number;
    avg_rating: number;
    model_previews: string[];
  };
  rank?: number;
}

const defaultImages = [crystalImage, characterImage, dragonImage, pizzaImage];
const rankEmojis = ["🥇", "🥈", "🥉"];

export default function CreatorCard({
  className = "",
  creator,
  rank,
}: CreatorCardProps) {
  // Fallback to default data if no creator is provided
  const displayName = creator?.username || "Chirag Joshi";
  const displayAvatar = creator?.avatar_url;
  const displayBio =
    creator?.bio ||
    "CAD designer specializing in 3D modeling and product design";
  const displayModels = creator?.models_count || 21;
  const displayDownloads = creator?.total_downloads || 4;
  const displayRating = creator?.avg_rating || 4;
  const displayPreviews = creator?.model_previews?.length
    ? creator.model_previews
    : defaultImages;
  const displayRankEmoji =
    rank !== undefined && rankEmojis[rank] ? rankEmojis[rank] : "🏆";

  return (
    <div
      className={`bg-[#191919] text-[hsl(var(--text-primary))] p-4 rounded-3xl w-[340px] font-sans shadow-2xl ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-2 px-2">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-24 h-24 rounded-2xl object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-[hsl(var(--card-darker))] flex items-center justify-center">
            <User className="w-12 h-12 text-[hsl(var(--text-secondary))]" />
          </div>
        )}
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[16px] font-semibold">{displayName}</h2>
            <span className="text-[16px]">{displayRankEmoji}</span>
          </div>
          <p className="text-[hsl(var(--text-secondary))] text-[12px] leading-relaxed">
            {displayBio}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-around mb-2 bg-[hsl(var(--card-darker))] rounded-2xl py-4 px-4">
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold mb-1">{displayModels}</div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Models
          </div>
        </div>
        <div className="border-l border-[hsl(var(--stat-border))]"></div>
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold mb-1">{displayDownloads}</div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Downloads
          </div>
        </div>
        <div className="border-l border-[hsl(var(--stat-border))]"></div>
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold flex items-center justify-center gap-1 mb-1">
            {displayRating}
            <span className="text-[hsl(var(--accent-gold))]">⭐</span>
          </div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Rating
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 gap-4 min-h-[328px]">
        {displayPreviews.slice(0, 4).map((preview, index) => (
          <div
            key={index}
            className="bg-[hsl(var(--card-darker))] rounded-2xl overflow-hidden aspect-square"
          >
            <img
              src={preview}
              alt={`Model preview ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default image if preview fails to load
                e.currentTarget.src =
                  defaultImages[index % defaultImages.length];
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
