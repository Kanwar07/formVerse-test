
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FormIQInsightProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  metrics?: { label: string; value: string }[];
  className?: string;
}

export function FormIQInsight({ 
  title, 
  content, 
  icon, 
  metrics,
  className 
}: FormIQInsightProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={cn(
      "formiq-card border-muted hover:border-primary/20 transition-colors duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {icon && <div className="mr-3 formiq-icon-bg">{icon}</div>}
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{content}</p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 formiq-glass">
            <div className="space-y-2">
              <h4 className="font-medium">How FormIQ Generated This Insight</h4>
              <p className="text-sm text-muted-foreground">
                FormIQ analyzes your model data, market trends, and user behavior to provide intelligent recommendations.
              </p>
              <div className="text-xs text-muted-foreground pt-2">
                <p>Confidence: High</p>
                <p>Data sources: Model geometry, Market analytics, User preferences</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {metrics && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-muted">
          <div className="text-sm">
            {/* Additional insights could go here */}
            <p className="text-muted-foreground">FormIQ is continuously learning from platform data to improve recommendations.</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Learn More"}
        </Button>
      </div>
    </div>
  );
}
