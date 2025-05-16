
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface FormIQFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  actionLabel?: string;
  onAction?: () => void;
  beta?: boolean;
  className?: string;
}

export function FormIQFeatureCard({
  title,
  description,
  icon,
  enabled = true,
  onToggle,
  actionLabel,
  onAction,
  beta = false,
  className,
}: FormIQFeatureCardProps) {
  return (
    <div className={cn(
      "formiq-card group hover:border-primary/20 transition-all duration-300",
      enabled ? "bg-card" : "bg-muted/30",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="mr-4 p-2.5 rounded-full bg-primary/10 text-primary">{icon}</div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{title}</h3>
              {beta && (
                <Badge variant="outline" className="ml-2 text-xs py-0 h-5">BETA</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {onToggle && (
          <Switch 
            checked={enabled} 
            onCheckedChange={onToggle} 
            className="data-[state=checked]:bg-primary"
          />
        )}
      </div>
      
      {enabled && onAction && actionLabel && (
        <div className="mt-6 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAction} 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
