import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FILE_FORMATS, DESIGN_COMPLEXITY_LEVELS } from "@/types/onboarding";

interface TechnicalCapabilitiesStepProps {
  fileFormats: string[];
  designComplexityLevel: string[];
  onFileFormatsChange: (formats: string[]) => void;
  onDesignComplexityChange: (complexity: string[]) => void;
}

export function TechnicalCapabilitiesStep({
  fileFormats,
  designComplexityLevel,
  onFileFormatsChange,
  onDesignComplexityChange
}: TechnicalCapabilitiesStepProps) {
  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      onFileFormatsChange([...fileFormats, format]);
    } else {
      onFileFormatsChange(fileFormats.filter(f => f !== format));
    }
  };

  const handleComplexityChange = (complexity: string, checked: boolean) => {
    if (checked) {
      onDesignComplexityChange([...designComplexityLevel, complexity]);
    } else {
      onDesignComplexityChange(designComplexityLevel.filter(c => c !== complexity));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Formats</CardTitle>
          <p className="text-sm text-muted-foreground">
            Which file formats can you work with? (select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FILE_FORMATS.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${format}`}
                  checked={fileFormats.includes(format)}
                  onCheckedChange={(checked) => handleFormatChange(format, checked as boolean)}
                />
                <Label htmlFor={`format-${format}`} className="text-sm">
                  {format}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Design Complexity Level</CardTitle>
          <p className="text-sm text-muted-foreground">
            What level of design complexity can you handle? (select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DESIGN_COMPLEXITY_LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`complexity-${level}`}
                  checked={designComplexityLevel.includes(level)}
                  onCheckedChange={(checked) => handleComplexityChange(level, checked as boolean)}
                />
                <Label htmlFor={`complexity-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}