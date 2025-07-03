
import { Card, CardContent } from "@/components/ui/card";
import { FileImage, Database, Code } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Powered by FormIQ™ AI</h2>
          <p className="text-muted-foreground">
            Our proprietary AI system that makes creating, validating, and monetizing CAD models seamless and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-tagging</h3>
              <p className="text-muted-foreground">
                AI-powered automatic tagging of your 3D models for better discoverability.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Printability Check</h3>
              <p className="text-muted-foreground">
                Validate your designs with our advanced mesh analysis and receive a readiness score.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted transition-transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensing</h3>
              <p className="text-muted-foreground">
                Intelligent pricing suggestions and flexible licensing options for your models.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
