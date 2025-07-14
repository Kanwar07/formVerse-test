import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CREATOR_ROLES } from "@/types/onboarding";

interface ProfessionalBackgroundStepProps {
  userRole: string;
  totalExperienceYears: number;
  teamCollaborationExperience: boolean;
  commercialProjectExperience: boolean;
  onUserRoleChange: (role: string) => void;
  onTotalExperienceYearsChange: (years: number) => void;
  onTeamCollaborationExperienceChange: (value: boolean) => void;
  onCommercialProjectExperienceChange: (value: boolean) => void;
}

export function ProfessionalBackgroundStep({
  userRole,
  totalExperienceYears,
  teamCollaborationExperience,
  commercialProjectExperience,
  onUserRoleChange,
  onTotalExperienceYearsChange,
  onTeamCollaborationExperienceChange,
  onCommercialProjectExperienceChange
}: ProfessionalBackgroundStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Background</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about your professional experience and background
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="user-role">Current Role</Label>
            <Select value={userRole} onValueChange={onUserRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {CREATOR_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total-experience">Total Years of Design Experience</Label>
            <Input
              id="total-experience"
              type="number"
              min="0"
              max="50"
              value={totalExperienceYears}
              onChange={(e) => onTotalExperienceYearsChange(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="team-collaboration"
              checked={teamCollaborationExperience}
              onCheckedChange={onTeamCollaborationExperienceChange}
            />
            <Label htmlFor="team-collaboration">
              I have experience working with design teams
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="commercial-experience"
              checked={commercialProjectExperience}
              onCheckedChange={onCommercialProjectExperienceChange}
            />
            <Label htmlFor="commercial-experience">
              I have experience with commercial/client projects
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}