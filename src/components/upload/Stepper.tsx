
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="relative mb-12">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted"></div>
      <div className="relative flex justify-between">
        <div className="flex flex-col items-center">
          <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <p className="mt-2 text-sm font-medium">Upload</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <p className="mt-2 text-sm font-medium">Details & Tags</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
          </div>
          <p className="mt-2 text-sm font-medium">Pricing & License</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            "4"
          </div>
          <p className="mt-2 text-sm font-medium">Review & Publish</p>
        </div>
      </div>
    </div>
  );
};
