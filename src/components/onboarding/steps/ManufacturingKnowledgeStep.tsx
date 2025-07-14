import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MANUFACTURING_PROCESSES, QUALITY_CONTROL_KNOWLEDGE, STANDARDS_COMPLIANCE } from "@/types/onboarding";

interface ManufacturingKnowledgeStepProps {
  manufacturingProcesses: string[];
  printingExperience: Record<string, any>;
  qualityControlKnowledge: string[];
  standardsCompliance: string[];
  onManufacturingProcessesChange: (processes: string[]) => void;
  onPrintingExperienceChange: (experience: Record<string, any>) => void;
  onQualityControlKnowledgeChange: (knowledge: string[]) => void;
  onStandardsComplianceChange: (standards: string[]) => void;
}

export function ManufacturingKnowledgeStep({
  manufacturingProcesses,
  printingExperience,
  qualityControlKnowledge,
  standardsCompliance,
  onManufacturingProcessesChange,
  onPrintingExperienceChange,
  onQualityControlKnowledgeChange,
  onStandardsComplianceChange
}: ManufacturingKnowledgeStepProps) {
  const handleProcessChange = (process: string, checked: boolean) => {
    if (checked) {
      onManufacturingProcessesChange([...manufacturingProcesses, process]);
    } else {
      onManufacturingProcessesChange(manufacturingProcesses.filter(p => p !== process));
    }
  };

  const handleQualityChange = (quality: string, checked: boolean) => {
    if (checked) {
      onQualityControlKnowledgeChange([...qualityControlKnowledge, quality]);
    } else {
      onQualityControlKnowledgeChange(qualityControlKnowledge.filter(q => q !== quality));
    }
  };

  const handleStandardChange = (standard: string, checked: boolean) => {
    if (checked) {
      onStandardsComplianceChange([...standardsCompliance, standard]);
    } else {
      onStandardsComplianceChange(standardsCompliance.filter(s => s !== standard));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing Knowledge</CardTitle>
          <p className="text-sm text-muted-foreground">
            What manufacturing processes are you familiar with? (select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANUFACTURING_PROCESSES.map((process) => (
              <div key={process.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`process-${process.value}`}
                  checked={manufacturingProcesses.includes(process.value)}
                  onCheckedChange={(checked) => handleProcessChange(process.value, checked as boolean)}
                />
                <Label htmlFor={`process-${process.value}`} className="text-sm">
                  {process.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3D Printing Experience</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tell us about your specific 3D printing experience
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={printingExperience.details || ''}
            onChange={(e) => onPrintingExperienceChange({ ...printingExperience, details: e.target.value })}
            placeholder="Describe your 3D printing experience, including materials used, printer types, post-processing techniques, etc."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control & Standards</CardTitle>
          <p className="text-sm text-muted-foreground">
            What quality control methods and standards are you familiar with?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Quality Control Knowledge</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {QUALITY_CONTROL_KNOWLEDGE.map((quality) => (
                <div key={quality} className="flex items-center space-x-2">
                  <Checkbox
                    id={`quality-${quality}`}
                    checked={qualityControlKnowledge.includes(quality)}
                    onCheckedChange={(checked) => handleQualityChange(quality, checked as boolean)}
                  />
                  <Label htmlFor={`quality-${quality}`} className="text-sm">
                    {quality}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Standards Compliance</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {STANDARDS_COMPLIANCE.map((standard) => (
                <div key={standard} className="flex items-center space-x-2">
                  <Checkbox
                    id={`standard-${standard}`}
                    checked={standardsCompliance.includes(standard)}
                    onCheckedChange={(checked) => handleStandardChange(standard, checked as boolean)}
                  />
                  <Label htmlFor={`standard-${standard}`} className="text-sm">
                    {standard}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}