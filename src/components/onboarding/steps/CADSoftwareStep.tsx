import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { CAD_SOFTWARE_OPTIONS, PROFICIENCY_LEVELS, CADSoftwareSkill } from "@/types/onboarding";

interface CADSoftwareStepProps {
  data: CADSoftwareSkill[];
  onUpdate: (skills: CADSoftwareSkill[]) => void;
}

export function CADSoftwareStep({ data, onUpdate }: CADSoftwareStepProps) {
  const [skills, setSkills] = useState<CADSoftwareSkill[]>(
    data.length > 0 ? data : [{ software: '', proficiency: 'beginner' as const, years_experience: 0, certified: false }]
  );

  const addSkill = () => {
    const newSkills = [...skills, { software: '', proficiency: 'beginner' as const, years_experience: 0, certified: false }];
    setSkills(newSkills);
    onUpdate(newSkills);
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    onUpdate(newSkills);
  };

  const updateSkill = (index: number, field: keyof CADSoftwareSkill, value: any) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
    onUpdate(newSkills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAD Software Proficiency</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about your experience with CAD software tools
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Software #{index + 1}</h4>
              {skills.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`software-${index}`}>CAD Software</Label>
                <Select
                  value={skill.software}
                  onValueChange={(value) => updateSkill(index, 'software', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select software" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-50">
                    {CAD_SOFTWARE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`proficiency-${index}`}>Proficiency Level</Label>
                <Select
                  value={skill.proficiency}
                  onValueChange={(value) => updateSkill(index, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-50">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`years-${index}`}>Years of Experience</Label>
                <Input
                  id={`years-${index}`}
                  type="number"
                  min="0"
                  max="50"
                  value={skill.years_experience}
                  onChange={(e) => updateSkill(index, 'years_experience', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`certified-${index}`}
                  checked={skill.certified}
                  onCheckedChange={(checked) => updateSkill(index, 'certified', checked)}
                />
                <Label htmlFor={`certified-${index}`}>Certified</Label>
              </div>
            </div>
          </div>
        ))}
        
        <Button onClick={addSkill} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Software
        </Button>
      </CardContent>
    </Card>
  );
}