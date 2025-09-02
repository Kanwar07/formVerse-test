import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Maximize2 } from 'lucide-react';
import { Lightbox } from './Lightbox';

interface GalleryItem {
  id: string;
  title: string;
  genre: string;
  badge: string;
  videoSrc: string | null;
  thumbnail: string;
  description: string;
  duration: string;
}

interface MasonryGalleryProps {
  items: GalleryItem[];
}

export function MasonryGallery({ items }: MasonryGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for video autoplay
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute('data-item-id');
          if (!itemId) return;

          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, itemId]));
            
            // Lazy load video
            const video = entry.target.querySelector('video') as HTMLVideoElement;
            if (video && video.dataset.src && !loadedVideos.has(itemId)) {
              video.src = video.dataset.src;
              video.load();
              setLoadedVideos(prev => new Set([...prev, itemId]));
            }
          } else {
            setVisibleItems(prev => {
              const newSet = new Set([...prev]);
              newSet.delete(itemId);
              return newSet;
            });
            
            // Pause video when out of view
            const video = entry.target.querySelector('video') as HTMLVideoElement;
            if (video) {
              video.pause();
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.25
      }
    );

    const cards = document.querySelectorAll('[data-gallery-item]');
    cards.forEach(card => observerRef.current?.observe(card));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadedVideos]);

  // Handle reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setLightboxOpen(true);
    
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'gallery_open', {
        item_id: item.id,
        item_genre: item.genre,
        item_title: item.title
      });
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
  };

  // Masonry grid heights for variety
  const getItemHeight = (index: number) => {
    const heights = [300, 400, 350, 450, 320, 380];
    return heights[index % heights.length];
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Featured Gallery
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of high-quality CAD renderings across multiple industries. 
            Each animation showcases photorealistic materials and professional lighting.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {items.map((item, index) => {
            const isVisible = visibleItems.has(item.id);
            const itemHeight = getItemHeight(index);
            
            return (
              <Card
                key={item.id}
                data-item-id={item.id}
                data-gallery-item
                className="break-inside-avoid elegant-glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                style={{ height: `${itemHeight}px` }}
                onClick={() => openLightbox(item)}
              >
                <CardContent className="p-0 h-full relative overflow-hidden">
                  {/* Video/Thumbnail */}
                  <div className="relative w-full h-2/3 overflow-hidden">
                    {item.videoSrc && !prefersReducedMotion() ? (
                      <video
                        data-src={item.videoSrc} // Lazy loading
                        muted
                        loop
                        playsInline
                        autoPlay={isVisible}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        poster={item.thumbnail}
                        onLoadedMetadata={(e) => {
                          // Auto-play when loaded and visible
                          if (isVisible) {
                            (e.target as HTMLVideoElement).play().catch(() => {
                              // Fallback to thumbnail if autoplay fails
                            });
                          }
                        }}
                      />
                    ) : (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Video overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Maximize2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-black/50 text-white border-white/20 backdrop-blur-sm"
                      >
                        {item.badge}
                      </Badge>
                    </div>

                    {/* Duration */}
                    {item.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 h-1/3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* View indicator */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>Click to view</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        1080p available
                      </span>
                    </div>
                  </div>

                  {/* Loading state */}
                  {!loadedVideos.has(item.id) && item.videoSrc && (
                    <div className="absolute inset-0 bg-muted/10 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="elegant-button px-8 py-4">
            Load More Gallery Items
          </button>
        </div>

        {/* Performance Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Videos auto-pause when off-screen for optimal performance • 
            <span className="text-primary"> 720p/1080p available</span>
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          item={selectedItem}
        />
      )}
    </section>
  );
}