import crystalImage from "@/assets/landing/creatorSection/crystal-model.jpg";
import characterImage from "@/assets/landing/creatorSection/character-model.jpg";
import dragonImage from "@/assets/landing/creatorSection/dragon-model.jpg";
import pizzaImage from "@/assets/landing/creatorSection/pizza-model.jpg";

export default function CreatorCard({ className }) {
  return (
    <div
      className={`bg-[#191919] text-[hsl(var(--text-primary))] p-4 rounded-3xl w-[340px] font-sans shadow-2xl ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-2 px-2">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
          alt="Chirag Joshi"
          className="w-24 h-24 rounded-2xl object-cover"
        />
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[16px] font-semibold">Chirag Joshi</h2>
            <span className="text-[16px]">🏆</span>
          </div>
          <p className="text-[hsl(var(--text-secondary))] text-[12px] leading-relaxed">
            CAD designer specializing in 3D modeling and product design
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-around mb-2 bg-[hsl(var(--card-darker))] rounded-2xl py-4 px-4">
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold mb-1">21</div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Models
          </div>
        </div>
        <div className="border-l border-[hsl(var(--stat-border))]"></div>
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold mb-1">4</div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Downloads
          </div>
        </div>
        <div className="border-l border-[hsl(var(--stat-border))]"></div>
        <div className="text-center flex-1">
          <div className="text-[16px] font-bold flex items-center justify-center gap-1 mb-1">
            4<span className="text-[hsl(var(--accent-gold))]">⭐</span>
          </div>
          <div className="text-[hsl(var(--text-secondary))] text-[10px]">
            Rating
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Abstract Crystal */}
        <div className="bg-[hsl(var(--card-darker))] rounded-2xl overflow-hidden aspect-square">
          <img
            src={crystalImage}
            alt="Abstract 3D crystal model"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Character Model */}
        <div className="bg-gray-600 rounded-2xl overflow-hidden aspect-square">
          <img
            src={characterImage}
            alt="3D character model"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dragon/Creature */}
        <div className="bg-[hsl(var(--card-darker))] rounded-2xl overflow-hidden aspect-square">
          <img
            src={dragonImage}
            alt="3D dragon creature model"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Pizza */}
        <div className="bg-orange-900 rounded-2xl overflow-hidden aspect-square">
          <img
            src={pizzaImage}
            alt="3D pizza model"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
