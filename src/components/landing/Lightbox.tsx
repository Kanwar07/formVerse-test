import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    genre: string;
    badge: string;
    videoSrc: string | null;
    thumbnail: string;
    description: string;
    duration: string;
  };
}

// Simple 3D model fallback for GLB viewer
function ModelViewer3D() {
  return (
    <Center>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="hsl(var(--primary))" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Center>
  );
}

export function Lightbox({ isOpen, onClose, item }: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [viewMode, setViewMode] = useState<'video' | '3d'>('video');
  const [environmentPreset, setEnvironmentPreset] = useState('studio');

  // Environment presets for 3D viewer
  const envPresets = [
    { name: 'studio', label: 'Studio' },
    { name: 'city', label: 'City' },
    { name: 'sunset', label: 'Sunset' },
    { name: 'forest', label: 'Forest' }
  ];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setViewMode(item.videoSrc ? 'video' : '3d');
    }
  }, [isOpen, item]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isOpen]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          onClose();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyR':
          restart();
          break;
        case 'Digit1':
          setViewMode('video');
          break;
        case 'Digit2':
          setViewMode('3d');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard?.writeText(window.location.href);
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl w-full h-[90vh] p-0 bg-black border-white/20 overflow-hidden"
        onPointerMove={() => setShowControls(true)}
      >
        <div className="relative w-full h-full flex flex-col">
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* View Mode Toggle */}
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            {item.videoSrc && (
              <Button
                variant={viewMode === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('video')}
                className="bg-black/50 hover:bg-black/70 border-white/20"
              >
                Video
              </Button>
            )}
            <Button
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('3d')}
              className="bg-black/50 hover:bg-black/70 border-white/20"
            >
              3D View
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative">
            {viewMode === 'video' && item.videoSrc ? (
              <div className="w-full h-full relative">
                <video
                  ref={videoRef}
                  src={item.videoSrc}
                  className="w-full h-full object-contain"
                  loop
                  muted={isMuted}
                  poster={item.thumbnail}
                  onClick={togglePlayPause}
                />

                {/* Video Controls */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Center Play/Pause */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        onClick={togglePlayPause}
                        className="w-20 h-20 bg-black/50 hover:bg-black/70 rounded-full"
                      >
                        <Play className="h-8 w-8 text-white" />
                      </Button>
                    </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 h-1 rounded-full">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-200"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlayPause}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={restart}
                          className="text-white hover:bg-white/20"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleShare}
                          className="text-white hover:bg-white/20"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 3D Viewer
              <div className="w-full h-full relative">
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                >
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  
                  <Environment preset={environmentPreset as any} />
                  
                  <Suspense fallback={null}>
                    <ModelViewer3D />
                  </Suspense>

                  <OrbitControls enableZoom enablePan enableRotate />
                </Canvas>

                {/* 3D Controls */}
                <div className="absolute top-4 right-16 space-y-2">
                  <div className="bg-black/50 rounded-lg p-2 space-y-2">
                    <div className="text-white text-xs font-medium">Environment:</div>
                    {envPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant={environmentPreset === preset.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEnvironmentPreset(preset.name)}
                        className="w-full text-xs bg-transparent border-white/20"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-black/80 backdrop-blur-sm p-6 border-t border-white/10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-white/80 max-w-2xl">{item.description}</p>
              </div>
              
              <div className="text-right text-sm text-white/60">
                <div>Genre: {item.genre}</div>
                <div>Duration: {item.duration}</div>
                <div>Resolution: 1080p available</div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-20 right-4 bg-black/50 rounded-lg p-2 text-xs text-white/60">
            <div>Space: Play/Pause • M: Mute • R: Restart • 1/2: Switch view</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}