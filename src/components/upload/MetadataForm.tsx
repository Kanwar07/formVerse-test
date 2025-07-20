
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Plus, X } from "lucide-react";

interface MetadataFormProps {
  onBack: () => void;
  onContinue: (metadata: ModelMetadata) => void;
  initialData?: Partial<ModelMetadata>;
}

export interface ModelMetadata {
  industry: string;
  useCase: string;
  printMaterial: string[];
  complexity: string;
  intendedUse: string;
  customTags: string[];
  functionalRequirements: string[];
  targetAudience: string;
  supportStructures: boolean;
  assemblyRequired: boolean;
  notes: string;
}

const industries = [
  "Automotive", "Aerospace", "Medical", "Consumer Products", "Industrial",
  "Architecture", "Education", "Art & Design", "Gaming", "Electronics",
  "Fashion", "Jewelry", "Toys", "Tools", "Prototyping"
];

const useCases = [
  "Functional Part", "Prototype", "Educational Model", "Art/Decoration",
  "Replacement Part", "Tool/Jig", "Assembly Component", "Miniature/Scale Model",
  "Concept Visualization", "Custom Accessory"
];

const materials = [
  "PLA", "ABS", "PETG", "TPU", "Nylon", "PVA", "HIPS", "Wood Fill",
  "Metal Fill", "Carbon Fiber", "Resin", "Flexible", "Water Soluble"
];

const complexityLevels = [
  "Beginner", "Intermediate", "Advanced", "Expert"
];

export const MetadataForm = ({ onBack, onContinue, initialData }: MetadataFormProps) => {
  const [metadata, setMetadata] = useState<ModelMetadata>({
    industry: initialData?.industry || "",
    useCase: initialData?.useCase || "",
    printMaterial: initialData?.printMaterial || [],
    complexity: initialData?.complexity || "",
    intendedUse: initialData?.intendedUse || "",
    customTags: initialData?.customTags || [],
    functionalRequirements: initialData?.functionalRequirements || [],
    targetAudience: initialData?.targetAudience || "",
    supportStructures: initialData?.supportStructures || false,
    assemblyRequired: initialData?.assemblyRequired || false,
    notes: initialData?.notes || ""
  });

  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const handleMaterialToggle = (material: string) => {
    setMetadata(prev => ({
      ...prev,
      printMaterial: prev.printMaterial.includes(material)
        ? prev.printMaterial.filter(m => m !== material)
        : [...prev.printMaterial, material]
    }));
  };

  const addCustomTag = () => {
    if (newTag && !metadata.customTags.includes(newTag)) {
      setMetadata(prev => ({
        ...prev,
        customTags: [...prev.customTags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeCustomTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }));
  };

  const addRequirement = () => {
    if (newRequirement && !metadata.functionalRequirements.includes(newRequirement)) {
      setMetadata(prev => ({
        ...prev,
        functionalRequirements: [...prev.functionalRequirements, newRequirement]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (req: string) => {
    setMetadata(prev => ({
      ...prev,
      functionalRequirements: prev.functionalRequirements.filter(r => r !== req)
    }));
  };

  const handleSubmit = () => {
    onContinue(metadata);
  };

  const isValid = metadata.industry && metadata.useCase && metadata.printMaterial.length > 0 && metadata.complexity;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Model Metadata & Classification</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Help buyers find your design by providing detailed metadata. This information improves discoverability and enables better recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Industry *</Label>
              <Select value={metadata.industry} onValueChange={(value) => setMetadata(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Use Case *</Label>
              <Select value={metadata.useCase} onValueChange={(value) => setMetadata(prev => ({ ...prev, useCase: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  {useCases.map(useCase => (
                    <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Complexity Level *</Label>
              <Select value={metadata.complexity} onValueChange={(value) => setMetadata(prev => ({ ...prev, complexity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Audience</Label>
              <Input 
                placeholder="e.g., Engineers, Hobbyists, Students"
                value={metadata.targetAudience}
                onChange={(e) => setMetadata(prev => ({ ...prev, targetAudience: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Print Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Recommended Materials * (Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {materials.map(material => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      checked={metadata.printMaterial.includes(material)}
                      onCheckedChange={() => handleMaterialToggle(material)}
                    />
                    <Label className="text-sm">{material}</Label>
                  </div>
                ))}
              </div>
            </div>


            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={metadata.supportStructures}
                  onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, supportStructures: !!checked }))}
                />
                <Label>Requires Support Structures</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={metadata.assemblyRequired}
                  onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, assemblyRequired: !!checked }))}
                />
                <Label>Assembly Required</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Intended Use Description</Label>
            <Textarea 
              placeholder="Describe what this model is for and how it should be used..."
              value={metadata.intendedUse}
              onChange={(e) => setMetadata(prev => ({ ...prev, intendedUse: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label>Functional Requirements</Label>
            <div className="flex gap-2 mb-2">
              <Input 
                placeholder="Add requirement (e.g., waterproof, food-safe)"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <Button type="button" onClick={addRequirement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.functionalRequirements.map((req) => (
                <Badge key={req} variant="outline" className="flex items-center gap-1">
                  {req}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRequirement(req)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Custom Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input 
                placeholder="Add custom tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
              />
              <Button type="button" onClick={addCustomTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.customTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCustomTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Additional Notes</Label>
            <Textarea 
              placeholder="Any special printing instructions, warnings, or additional information..."
              value={metadata.notes}
              onChange={(e) => setMetadata(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
