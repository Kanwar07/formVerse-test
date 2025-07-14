import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { PRIMARY_GOALS, UPLOAD_FREQUENCY, TARGET_AUDIENCE, REVENUE_EXPECTATIONS } from "@/types/onboarding";

interface GoalsExpectationsStepProps {
  primaryGoals: string[];
  expectedUploadFrequency: string;
  targetAudience: string[];
  revenueExpectations: string;
  ipUnderstandingLevel: number;
  pricingStrategyExperience: boolean;
  customerServiceApproach: string;
  revisionWillingness: number;
  onPrimaryGoalsChange: (goals: string[]) => void;
  onExpectedUploadFrequencyChange: (frequency: string) => void;
  onTargetAudienceChange: (audience: string[]) => void;
  onRevenueExpectationsChange: (expectations: string) => void;
  onIPUnderstandingLevelChange: (level: number) => void;
  onPricingStrategyExperienceChange: (value: boolean) => void;
  onCustomerServiceApproachChange: (approach: string) => void;
  onRevisionWillingnessChange: (willingness: number) => void;
}

export function GoalsExpectationsStep({
  primaryGoals,
  expectedUploadFrequency,
  targetAudience,
  revenueExpectations,
  ipUnderstandingLevel,
  pricingStrategyExperience,
  customerServiceApproach,
  revisionWillingness,
  onPrimaryGoalsChange,
  onExpectedUploadFrequencyChange,
  onTargetAudienceChange,
  onRevenueExpectationsChange,
  onIPUnderstandingLevelChange,
  onPricingStrategyExperienceChange,
  onCustomerServiceApproachChange,
  onRevisionWillingnessChange
}: GoalsExpectationsStepProps) {
  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      onPrimaryGoalsChange([...primaryGoals, goal]);
    } else {
      onPrimaryGoalsChange(primaryGoals.filter(g => g !== goal));
    }
  };

  const handleAudienceChange = (audience: string, checked: boolean) => {
    if (checked) {
      onTargetAudienceChange([...targetAudience, audience]);
    } else {
      onTargetAudienceChange(targetAudience.filter(a => a !== audience));
    }
  };

  const ipLevelLabels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
  const revisionLabels = ['Reluctant', 'Limited', 'Moderate', 'Flexible', 'Very Flexible'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goals & Expectations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Help us understand your goals and expectations on the platform
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Primary Goals (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {PRIMARY_GOALS.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={primaryGoals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={`goal-${goal}`} className="text-sm">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="upload-frequency">Expected Upload Frequency</Label>
              <Select value={expectedUploadFrequency} onValueChange={onExpectedUploadFrequencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50">
                  {UPLOAD_FREQUENCY.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="revenue-expectations">Revenue Expectations</Label>
              <Select value={revenueExpectations} onValueChange={onRevenueExpectationsChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expectations" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50">
                  {REVENUE_EXPECTATIONS.map((expectation) => (
                    <SelectItem key={expectation} value={expectation}>
                      {expectation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Target Audience (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {TARGET_AUDIENCE.map((audience) => (
                <div key={audience} className="flex items-center space-x-2">
                  <Checkbox
                    id={`audience-${audience}`}
                    checked={targetAudience.includes(audience)}
                    onCheckedChange={(checked) => handleAudienceChange(audience, checked as boolean)}
                  />
                  <Label htmlFor={`audience-${audience}`} className="text-sm">
                    {audience}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Readiness</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assess your readiness for commercial aspects of selling designs
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">
              Intellectual Property Understanding: {ipLevelLabels[ipUnderstandingLevel - 1]}
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              How well do you understand copyright, licensing, and IP laws?
            </p>
            <Slider
              value={[ipUnderstandingLevel]}
              onValueChange={(value) => onIPUnderstandingLevelChange(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-base font-medium">
              Revision Willingness: {revisionLabels[revisionWillingness - 1]}
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              How willing are you to make revisions/customizations for buyers?
            </p>
            <Slider
              value={[revisionWillingness]}
              onValueChange={(value) => onRevisionWillingnessChange(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pricing-strategy"
              checked={pricingStrategyExperience}
              onCheckedChange={onPricingStrategyExperienceChange}
            />
            <Label htmlFor="pricing-strategy">
              I have experience with pricing strategies for design work
            </Label>
          </div>

          <div>
            <Label htmlFor="customer-service">Customer Service Approach</Label>
            <Textarea
              id="customer-service"
              value={customerServiceApproach}
              onChange={(e) => onCustomerServiceApproachChange(e.target.value)}
              placeholder="Describe your approach to customer service and client communication..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}