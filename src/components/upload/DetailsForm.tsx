
import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight } from "lucide-react";
import { FormIQInsight } from "@/components/formiq/FormIQInsight";
import { Info, Printer } from "lucide-react";
import { ModelInsightsService } from "@/services/modelInsights";

interface DetailsFormProps {
  aiGeneratedTags: string[];
  onBack: () => void;
  onContinue: (name: string, description: string, tags: string[]) => void;
  initialName?: string;
  initialDescription?: string;
  required?: boolean;
}

export const DetailsForm = ({ 
  aiGeneratedTags, 
  onBack, 
  onContinue,
  initialName = "",
  initialDescription = "",
  required = false
}: DetailsFormProps) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [generatedInsights, setGeneratedInsights] = useState<any>(null);

  const handleAddTag = () => {
    if (newTag && !customTags.includes(newTag) && !aiGeneratedTags.includes(newTag)) {
      setCustomTags([...customTags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (required && !name.trim()) {
      return; // Don't proceed if name is required but empty
    }
    onContinue(name, description, customTags);
  };

  // Update insights when name or description changes
  React.useEffect(() => {
    if (name || description) {
      const insights = ModelInsightsService.generateInsights(name, description);
      const formatted = ModelInsightsService.formatInsightsForDisplay(insights);
      setGeneratedInsights(formatted);
    }
  }, [name, description]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="model-name">
          Model Name {required && <span className="text-destructive">*</span>}
        </Label>
        <Input 
          id="model-name" 
          placeholder="Enter a descriptive name for your model"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={required}
          className={required && !name.trim() ? "border-destructive" : ""}
        />
        {required && !name.trim() && (
          <p className="text-sm text-destructive mt-1">Model name is required</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="model-description">Description</Label>
        <Textarea 
          id="model-description" 
          placeholder="Describe your model, its features, and potential use cases..." 
          className="min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      {/* FormIQ Insights */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>FormIQ Insights</Label>
          <span className="text-xs flex items-center">
            <Brain className="h-3 w-3 text-primary mr-1" />
            AI-generated insights
          </span>
        </div>
        
        {/* AI Generated Insights */}
        {generatedInsights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormIQInsight
              title="Market Analysis"
              content={`This model has ${generatedInsights.marketAnalysis.demand.toLowerCase()} demand in relevant industries.`}
              icon={<Info className="h-4 w-4 text-primary" />}
              metrics={[
                { label: "Market Demand", value: generatedInsights.marketAnalysis.demand },
                { label: "Target Industries", value: generatedInsights.marketAnalysis.industries }
              ]}
            />
            
            <FormIQInsight
              title="Printing Recommendations"
              content={`Optimal results with ${generatedInsights.printingRecommendations.techniques[0]} printing.`}
              icon={<Printer className="h-4 w-4 text-primary" />}
              metrics={[
                { label: "Primary Technique", value: generatedInsights.printingRecommendations.techniques[0] },
                { label: "Materials", value: generatedInsights.printingRecommendations.materials.slice(0, 2).join(', ') }
              ]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormIQInsight
              title="Market Analysis"
              content="Enter model name and description to generate insights."
              icon={<Info className="h-4 w-4 text-muted-foreground" />}
              metrics={[
                { label: "Market Demand", value: "Analyzing..." },
                { label: "Target Industries", value: "Analyzing..." }
              ]}
            />
            
            <FormIQInsight
              title="Printing Recommendations"
              content="Insights will be generated based on your model details."
              icon={<Printer className="h-4 w-4 text-muted-foreground" />}
              metrics={[
                { label: "Primary Technique", value: "Analyzing..." },
                { label: "Materials", value: "Analyzing..." }
              ]}
            />
          </div>
        )}

        {/* Auto-generated badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
          <Brain className="h-3 w-3" />
          <span>Auto-generated insights • These are placeholder insights until AI integration is ready</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Tags</Label>
          <span className="text-xs text-muted-foreground flex items-center">
            <Brain className="h-3 w-3 text-primary mr-1" />
            AI-generated + custom tags
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {aiGeneratedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
              {tag}
              <span className="ml-1 text-xs">(AI)</span>
            </Badge>
          ))}
          
          {customTags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex gap-2">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">
                ×
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Add custom tag..." 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button variant="outline" onClick={handleAddTag}>Add</Button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button 
          onClick={handleSubmit}
          disabled={required && !name.trim()}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
