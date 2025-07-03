
import { Card, CardContent } from "@/components/ui/card";
import { FileImage, Database, Code } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-32 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 elegant-grid opacity-20"></div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-6 matrix-text elegant-text-glow">Powered by FormIQ™ AI</h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Our proprietary AI system that makes creating, validating, and monetizing CAD models seamless and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card className="overflow-hidden border-0 shadow-none bg-transparent transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02] group">
            <CardContent className="pt-8 p-8">
              <div className="elegant-glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6 rounded-2xl w-16 h-16 formiq-icon-bg flex items-center justify-center">
                    <FileImage className="h-8 w-8 text-white/80" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 matrix-text text-white/90">Auto-tagging</h3>
                  <p className="text-white/70 leading-relaxed font-light">
                    AI-powered automatic tagging of your 3D models for better discoverability and enhanced marketplace visibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-none bg-transparent transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02] group">
            <CardContent className="pt-8 p-8">
              <div className="elegant-glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6 rounded-2xl w-16 h-16 formiq-icon-bg flex items-center justify-center">
                    <Database className="h-8 w-8 text-white/80" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 matrix-text text-white/90">Printability Check</h3>
                  <p className="text-white/70 leading-relaxed font-light">
                    Validate your designs with our advanced mesh analysis and receive a comprehensive readiness score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-none bg-transparent transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02] group">
            <CardContent className="pt-8 p-8">
              <div className="elegant-glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6 rounded-2xl w-16 h-16 formiq-icon-bg flex items-center justify-center">
                    <Code className="h-8 w-8 text-white/80" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 matrix-text text-white/90">Smart Licensing</h3>
                  <p className="text-white/70 leading-relaxed font-light">
                    Intelligent pricing suggestions and flexible licensing options tailored to your models and market demand.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
