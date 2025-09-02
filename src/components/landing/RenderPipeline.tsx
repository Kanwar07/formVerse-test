import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Palette, Cloud, Play, Pause } from 'lucide-react';

const pipelineSteps = [
  {
    id: 'import',
    icon: Upload,
    title: 'Import CAD',
    description: 'Upload your 3D models in any format',
    details: 'Supports STL, OBJ, STEP, IGES, GLB, and more. Automatic format detection and optimization.',
    color: 'primary'
  },
  {
    id: 'materials',
    icon: Palette,
    title: 'Auto-Materials & PBR',
    description: 'Intelligent material assignment and PBR baking',
    details: 'AI-powered material recognition with physically-based rendering for photorealistic results.',
    color: 'accent'
  },
  {
    id: 'render',
    icon: Cloud,
    title: 'Cloud Render',
    description: 'High-performance cloud rendering pipeline',
    details: 'Distributed rendering with real-time progress tracking and multiple output formats.',
    color: 'secondary'
  }
];

export function RenderPipeline() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [demoPlaying, setDemoPlaying] = useState(false);

  const toggleDemo = () => {
    setDemoPlaying(!demoPlaying);
    
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'render_pipeline_demo', {
        action: demoPlaying ? 'pause' : 'play'
      });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              How It Renders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Our three-step pipeline transforms your CAD models into stunning, 
            photoreal animations with automated material assignment and cloud-powered rendering.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            
            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                
                <Card 
                  className={`elegant-glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group relative z-10 ${
                    isActive ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${step.color}/20 to-${step.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 text-${step.color}`} />
                    </div>

                    {/* Step Number */}
                    <div className="text-sm text-muted-foreground mb-2 font-medium">
                      Step {index + 1}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Expandable Details */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Interactive Demo Section */}
        <div className="elegant-glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Demo Controls */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">
                Interactive Pipeline Demo
              </h3>
              <p className="text-muted-foreground mb-6">
                Watch how material assignment and lighting changes transform your CAD model 
                in real-time. Toggle between different material presets and lighting rigs.
              </p>

              <div className="space-y-4">
                {/* Play/Pause Control */}
                <Button
                  onClick={toggleDemo}
                  size="lg"
                  className="elegant-button"
                >
                  {demoPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {demoPlaying ? 'Pause Demo' : 'Play Demo'}
                </Button>

                {/* Material Presets */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material Preset:</label>
                  <div className="flex gap-2">
                    {['Metal', 'Plastic', 'Glass', 'Ceramic'].map((material) => (
                      <Button
                        key={material}
                        variant="outline"
                        size="sm"
                        className="elegant-glass border-white/20 hover:border-white/30"
                      >
                        {material}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Lighting Presets */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lighting Rig:</label>
                  <div className="flex gap-2">
                    {['Studio', 'Natural', 'Dramatic', 'Soft'].map((lighting) => (
                      <Button
                        key={lighting}
                        variant="outline"
                        size="sm"
                        className="elegant-glass border-white/20 hover:border-white/30"
                      >
                        {lighting}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Viewer */}
            <div className="relative h-64 md:h-80 elegant-glass rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/5">
                {demoPlaying ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Demo playing • Material: Metal • Lighting: Studio
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                      <Pause className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click play to start the interactive demo
                    </p>
                  </div>
                )}
              </div>

              {/* Demo overlay effects */}
              {demoPlaying && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-slide-glow" />
                  <div className="absolute inset-0 animate-glow-pulse opacity-20" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}