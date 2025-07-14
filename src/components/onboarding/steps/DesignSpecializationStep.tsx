import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { INDUSTRY_FOCUS_OPTIONS, DESIGN_CATEGORIES } from "@/types/onboarding";

interface DesignSpecializationStepProps {
  industryFocus: string[];
  designCategories: string[];
  onIndustryFocusChange: (focus: string[]) => void;
  onDesignCategoriesChange: (categories: string[]) => void;
}

export function DesignSpecializationStep({
  industryFocus,
  designCategories,
  onIndustryFocusChange,
  onDesignCategoriesChange
}: DesignSpecializationStepProps) {
  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      onIndustryFocusChange([...industryFocus, industry]);
    } else {
      onIndustryFocusChange(industryFocus.filter(i => i !== industry));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onDesignCategoriesChange([...designCategories, category]);
    } else {
      onDesignCategoriesChange(designCategories.filter(c => c !== category));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Focus</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the industries you specialize in (select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_FOCUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${option.value}`}
                  checked={industryFocus.includes(option.value)}
                  onCheckedChange={(checked) => handleIndustryChange(option.value, checked as boolean)}
                />
                <Label htmlFor={`industry-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Design Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            What types of designs do you create? (select all that apply)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DESIGN_CATEGORIES.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={designCategories.includes(category.value)}
                  onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                />
                <Label htmlFor={`category-${category.value}`} className="text-sm">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}