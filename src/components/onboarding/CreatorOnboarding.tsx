import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import { OnboardingProgress } from "./OnboardingProgress";
import { CADSoftwareStep } from "./steps/CADSoftwareStep";
import { DesignSpecializationStep } from "./steps/DesignSpecializationStep";
import { TechnicalCapabilitiesStep } from "./steps/TechnicalCapabilitiesStep";
import { ManufacturingKnowledgeStep } from "./steps/ManufacturingKnowledgeStep";
import { ProfessionalBackgroundStep } from "./steps/ProfessionalBackgroundStep";
import { GoalsExpectationsStep } from "./steps/GoalsExpectationsStep";
import { CreatorOnboardingData } from "@/types/onboarding";

const STEP_TITLES = [
  "CAD Software",
  "Specialization",
  "Technical Skills",
  "Manufacturing",
  "Background",
  "Goals & Business"
];

const TOTAL_STEPS = 6;

export function CreatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreatorOnboardingData>({
    cad_software_skills: [],
    industry_focus: [],
    design_categories: [],
    file_formats: [],
    design_complexity_level: [],
    manufacturing_processes: [],
    printing_experience: {},
    user_role: 'hobbyist',
    total_experience_years: 0,
    team_collaboration_experience: false,
    commercial_project_experience: false,
    quality_control_knowledge: [],
    standards_compliance: [],
    portfolio_samples: [],
    ip_understanding_level: 1,
    pricing_strategy_experience: false,
    customer_service_approach: '',
    revision_willingness: 3,
    rendering_software: [],
    simulation_tools: [],
    collaboration_platforms: [],
    primary_goals: [],
    expected_upload_frequency: '',
    target_audience: [],
    revenue_expectations: '',
    onboarding_step: 1,
    onboarding_completed: false
  });

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('creator_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding data:', error);
        return;
      }

      if (data) {
        // Convert database data to form data with proper types
        const convertedData: CreatorOnboardingData = {
          cad_software_skills: (data.cad_software_skills as any) || [],
          industry_focus: data.industry_focus || [],
          design_categories: data.design_categories || [],
          file_formats: data.file_formats || [],
          design_complexity_level: data.design_complexity_level || [],
          manufacturing_processes: data.manufacturing_processes || [],
          printing_experience: (data.printing_experience as any) || {},
          user_role: data.user_role as any,
          total_experience_years: data.total_experience_years || 0,
          team_collaboration_experience: data.team_collaboration_experience || false,
          commercial_project_experience: data.commercial_project_experience || false,
          quality_control_knowledge: data.quality_control_knowledge || [],
          standards_compliance: data.standards_compliance || [],
          portfolio_samples: (data.portfolio_samples as any) || [],
          ip_understanding_level: data.ip_understanding_level || 1,
          pricing_strategy_experience: data.pricing_strategy_experience || false,
          customer_service_approach: data.customer_service_approach || '',
          revision_willingness: data.revision_willingness || 3,
          rendering_software: data.rendering_software || [],
          simulation_tools: data.simulation_tools || [],
          collaboration_platforms: data.collaboration_platforms || [],
          primary_goals: data.primary_goals || [],
          expected_upload_frequency: data.expected_upload_frequency || '',
          target_audience: data.target_audience || [],
          revenue_expectations: data.revenue_expectations || '',
          onboarding_step: data.onboarding_step || 1,
          onboarding_completed: data.onboarding_completed || false
        };
        
        setFormData(convertedData);
        setCurrentStep(data.onboarding_step || 1);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Convert form data to database format with proper type casting
      const dbData = {
        user_id: user.id,
        cad_software_skills: formData.cad_software_skills as any,
        industry_focus: formData.industry_focus as any,
        design_categories: formData.design_categories as any,
        file_formats: formData.file_formats,
        design_complexity_level: formData.design_complexity_level,
        manufacturing_processes: formData.manufacturing_processes as any,
        printing_experience: formData.printing_experience as any,
        user_role: formData.user_role as any,
        total_experience_years: formData.total_experience_years,
        team_collaboration_experience: formData.team_collaboration_experience,
        commercial_project_experience: formData.commercial_project_experience,
        quality_control_knowledge: formData.quality_control_knowledge,
        standards_compliance: formData.standards_compliance,
        portfolio_samples: formData.portfolio_samples as any,
        ip_understanding_level: formData.ip_understanding_level,
        pricing_strategy_experience: formData.pricing_strategy_experience,
        customer_service_approach: formData.customer_service_approach,
        revision_willingness: formData.revision_willingness,
        rendering_software: formData.rendering_software,
        simulation_tools: formData.simulation_tools,
        collaboration_platforms: formData.collaboration_platforms,
        primary_goals: formData.primary_goals,
        expected_upload_frequency: formData.expected_upload_frequency,
        target_audience: formData.target_audience,
        revenue_expectations: formData.revenue_expectations,
        onboarding_step: currentStep,
        onboarding_completed: currentStep >= TOTAL_STEPS
      } as any;

      const { error } = await supabase
        .from('creator_onboarding')
        .upsert(dbData, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving progress:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    try {
      await saveProgress();
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const finalData = {
        ...formData,
        onboarding_step: TOTAL_STEPS,
        onboarding_completed: true
      };

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Convert form data to database format with proper type casting
      const dbData = {
        user_id: user.id,
        cad_software_skills: finalData.cad_software_skills as any,
        industry_focus: finalData.industry_focus as any,
        design_categories: finalData.design_categories as any,
        file_formats: finalData.file_formats,
        design_complexity_level: finalData.design_complexity_level,
        manufacturing_processes: finalData.manufacturing_processes as any,
        printing_experience: finalData.printing_experience as any,
        user_role: finalData.user_role as any,
        total_experience_years: finalData.total_experience_years,
        team_collaboration_experience: finalData.team_collaboration_experience,
        commercial_project_experience: finalData.commercial_project_experience,
        quality_control_knowledge: finalData.quality_control_knowledge,
        standards_compliance: finalData.standards_compliance,
        portfolio_samples: finalData.portfolio_samples as any,
        ip_understanding_level: finalData.ip_understanding_level,
        pricing_strategy_experience: finalData.pricing_strategy_experience,
        customer_service_approach: finalData.customer_service_approach,
        revision_willingness: finalData.revision_willingness,
        rendering_software: finalData.rendering_software,
        simulation_tools: finalData.simulation_tools,
        collaboration_platforms: finalData.collaboration_platforms,
        primary_goals: finalData.primary_goals,
        expected_upload_frequency: finalData.expected_upload_frequency,
        target_audience: finalData.target_audience,
        revenue_expectations: finalData.revenue_expectations,
        onboarding_step: TOTAL_STEPS,
        onboarding_completed: true
      } as any;

      const { error } = await supabase
        .from('creator_onboarding')
        .upsert(dbData, { onConflict: 'user_id' });

      if (error) throw error;

      // Update user role in profiles table
      await supabase
        .from('profiles')
        .update({ role: 'creator' })
        .eq('id', user.id);

      toast({
        title: "Success!",
        description: "Onboarding completed successfully. Welcome to FormVerse!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CADSoftwareStep
            data={formData.cad_software_skills}
            onUpdate={(skills) => setFormData(prev => ({ ...prev, cad_software_skills: skills }))}
          />
        );
      case 2:
        return (
          <DesignSpecializationStep
            industryFocus={formData.industry_focus}
            designCategories={formData.design_categories}
            onIndustryFocusChange={(focus) => setFormData(prev => ({ ...prev, industry_focus: focus }))}
            onDesignCategoriesChange={(categories) => setFormData(prev => ({ ...prev, design_categories: categories }))}
          />
        );
      case 3:
        return (
          <TechnicalCapabilitiesStep
            fileFormats={formData.file_formats}
            designComplexityLevel={formData.design_complexity_level}
            onFileFormatsChange={(formats) => setFormData(prev => ({ ...prev, file_formats: formats }))}
            onDesignComplexityChange={(complexity) => setFormData(prev => ({ ...prev, design_complexity_level: complexity }))}
          />
        );
      case 4:
        return (
          <ManufacturingKnowledgeStep
            manufacturingProcesses={formData.manufacturing_processes}
            printingExperience={formData.printing_experience}
            qualityControlKnowledge={formData.quality_control_knowledge}
            standardsCompliance={formData.standards_compliance}
            onManufacturingProcessesChange={(processes) => setFormData(prev => ({ ...prev, manufacturing_processes: processes }))}
            onPrintingExperienceChange={(experience) => setFormData(prev => ({ ...prev, printing_experience: experience }))}
            onQualityControlKnowledgeChange={(knowledge) => setFormData(prev => ({ ...prev, quality_control_knowledge: knowledge }))}
            onStandardsComplianceChange={(standards) => setFormData(prev => ({ ...prev, standards_compliance: standards }))}
          />
        );
      case 5:
        return (
          <ProfessionalBackgroundStep
            userRole={formData.user_role}
            totalExperienceYears={formData.total_experience_years}
            teamCollaborationExperience={formData.team_collaboration_experience}
            commercialProjectExperience={formData.commercial_project_experience}
            onUserRoleChange={(role) => setFormData(prev => ({ ...prev, user_role: role as any }))}
            onTotalExperienceYearsChange={(years) => setFormData(prev => ({ ...prev, total_experience_years: years }))}
            onTeamCollaborationExperienceChange={(value) => setFormData(prev => ({ ...prev, team_collaboration_experience: value }))}
            onCommercialProjectExperienceChange={(value) => setFormData(prev => ({ ...prev, commercial_project_experience: value }))}
          />
        );
      case 6:
        return (
          <GoalsExpectationsStep
            primaryGoals={formData.primary_goals}
            expectedUploadFrequency={formData.expected_upload_frequency}
            targetAudience={formData.target_audience}
            revenueExpectations={formData.revenue_expectations}
            ipUnderstandingLevel={formData.ip_understanding_level}
            pricingStrategyExperience={formData.pricing_strategy_experience}
            customerServiceApproach={formData.customer_service_approach}
            revisionWillingness={formData.revision_willingness}
            onPrimaryGoalsChange={(goals) => setFormData(prev => ({ ...prev, primary_goals: goals }))}
            onExpectedUploadFrequencyChange={(frequency) => setFormData(prev => ({ ...prev, expected_upload_frequency: frequency }))}
            onTargetAudienceChange={(audience) => setFormData(prev => ({ ...prev, target_audience: audience }))}
            onRevenueExpectationsChange={(expectations) => setFormData(prev => ({ ...prev, revenue_expectations: expectations }))}
            onIPUnderstandingLevelChange={(level) => setFormData(prev => ({ ...prev, ip_understanding_level: level }))}
            onPricingStrategyExperienceChange={(value) => setFormData(prev => ({ ...prev, pricing_strategy_experience: value }))}
            onCustomerServiceApproachChange={(approach) => setFormData(prev => ({ ...prev, customer_service_approach: approach }))}
            onRevisionWillingnessChange={(willingness) => setFormData(prev => ({ ...prev, revision_willingness: willingness }))}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your onboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Creator Onboarding</h1>
            <p className="text-muted-foreground">
              Help us understand your expertise so we can match you with the right opportunities
            </p>
          </div>

          <OnboardingProgress 
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepTitles={STEP_TITLES}
          />

          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </div>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === TOTAL_STEPS ? (
                isSubmitting ? (
                  "Completing..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}