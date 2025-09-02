import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: string;
  title: string;
  tag: string;
  description: string;
  thumbnail: string;
  animationSrc: string | null;
  modelSrc: string | null;
  altText: string;
}

interface GenreCarouselProps {
  genres: Genre[];
}

export function GenreCarousel({ genres }: GenreCarouselProps) {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(new Set());

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleIndexes(prev => new Set([...prev, index]));
          } else {
            setVisibleIndexes(prev => {
              const newSet = new Set([...prev]);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const cards = document.querySelectorAll('[data-genre-card]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [genres]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320; // Approximate card width + gap
    const scrollAmount = cardWidth * 2;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'genre_carousel_scroll', {
        direction: direction
      });
    }
  };

  const handleGenreClick = (genre: Genre) => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'genre_hover', {
        genre_id: genre.id,
        genre_title: genre.title
      });
    }
    
    navigate(`/discover?genre=${genre.id}`);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Explore by Genre
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover CAD models across industries, from automotive to aerospace, 
            each with specialized rendering techniques.
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="elegant-glass border-white/20 hover:border-white/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"  
              onClick={() => scroll('right')}
              className="elegant-glass border-white/20 hover:border-white/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {genres.length} genres available
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {genres.map((genre, index) => (
            <Card
              key={genre.id}
              data-index={index}
              data-genre-card
              className="flex-shrink-0 w-80 h-96 snap-center elegant-glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleGenreClick(genre)}
            >
              <CardContent className="p-0 h-full relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={genre.thumbnail}
                    alt={genre.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Animation Overlay - Only visible on hover and in viewport */}
                {hoveredIndex === index && visibleIndexes.has(index) && (
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                )}

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className="space-y-3">
                    {/* Tag */}
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full backdrop-blur-sm">
                      {genre.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {genre.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/80 text-sm leading-relaxed">
                      {genre.description}
                    </p>

                    {/* CTA Link */}
                    <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors">
                      <span className="text-sm font-medium">View Collection</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Use arrow keys to navigate • Scroll horizontally for more genres
          </p>
        </div>
      </div>
    </section>
  );
}