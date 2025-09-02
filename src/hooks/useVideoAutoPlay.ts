import { useEffect, useRef, useCallback } from 'react';

interface UseVideoAutoPlayOptions {
  threshold?: number;
  rootMargin?: string;
  onPlay?: (element: HTMLVideoElement) => void;
  onPause?: (element: HTMLVideoElement) => void;
}

export function useVideoAutoPlay({
  threshold = 0.5,
  rootMargin = '50px',
  onPlay,
  onPause
}: UseVideoAutoPlayOptions = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videosRef = useRef<Map<Element, HTMLVideoElement>>(new Map());

  const observe = useCallback((element: HTMLVideoElement) => {
    if (!observerRef.current) return;
    
    observerRef.current.observe(element);
    videosRef.current.set(element, element);
  }, []);

  const unobserve = useCallback((element: HTMLVideoElement) => {
    if (!observerRef.current) return;
    
    observerRef.current.unobserve(element);
    videosRef.current.delete(element);
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Don't auto-play videos if user prefers reduced motion
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          
          if (entry.isIntersecting) {
            // Video is in view
            video.play().then(() => {
              onPlay?.(video);
            }).catch((error) => {
              console.log('Video autoplay failed:', error);
              // Autoplay failed, possibly due to browser policies
              // Could show a play button overlay here
            });
          } else {
            // Video is out of view
            if (!video.paused) {
              video.pause();
              onPause?.(video);
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    return () => {
      observerRef.current?.disconnect();
      videosRef.current.clear();
    };
  }, [threshold, rootMargin, onPlay, onPause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { observe, unobserve };
}

// Hook for lazy loading video sources
export function useVideoLazyLoad() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: HTMLVideoElement) => {
    if (!observerRef.current) return;
    
    observerRef.current.observe(element);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            const dataSrc = video.dataset.src;
            
            if (dataSrc && !video.src) {
              video.src = dataSrc;
              video.load();
              
              // Remove from observation once loaded
              observerRef.current?.unobserve(video);
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { observe };
}