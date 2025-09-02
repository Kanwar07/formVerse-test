
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero3D } from "@/components/landing/Hero3D";
import { GenreCarousel } from "@/components/landing/GenreCarousel";
import { RenderPipeline } from "@/components/landing/RenderPipeline";
import { MasonryGallery } from "@/components/landing/MasonryGallery";

const Landing = () => {
  const [genresData, setGenresData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load genres data
  useEffect(() => {
    const loadGenresData = async () => {
      try {
        const response = await fetch('/data/genres.json');
        const data = await response.json();
        setGenresData(data);
      } catch (error) {
        console.error('Failed to load genres data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenresData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading FormVerse experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Modern Hero with 3D */}
      <Hero3D />
      
      {/* Genre Carousel */}
      {genresData?.genres && (
        <GenreCarousel genres={genresData.genres} />
      )}
      
      {/* How It Renders Pipeline */}
      <RenderPipeline />
      
      {/* Featured Gallery */}
      {genresData?.featuredGallery && (
        <MasonryGallery items={genresData.featuredGallery} />
      )}
      
      <Footer />
    </div>
  );
};

export default Landing;
