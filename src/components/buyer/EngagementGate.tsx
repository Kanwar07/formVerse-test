
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Lock, User, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EngagementGateProps {
  modelId: string;
  modelName: string;
  previewImage: string;
  isPreview?: boolean;
  onEngagement?: (data: EngagementData) => void;
}

interface EngagementData {
  email: string;
  region: string;
  intendedUse: string;
  industry: string;
  timestamp: Date;
  action: 'preview' | 'download' | 'license';
}

export const EngagementGate = ({ 
  modelId, 
  modelName, 
  previewImage, 
  isPreview = false,
  onEngagement 
}: EngagementGateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    region: '',
    intendedUse: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (action: 'preview' | 'download' | 'license') => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please provide your email to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const engagementData: EngagementData = {
      ...formData,
      timestamp: new Date(),
      action
    };

    // Track engagement data
    console.log('Tracking engagement:', {
      modelId,
      ...engagementData
    });

    // Store in localStorage for demo purposes
    const existingData = JSON.parse(localStorage.getItem('buyer_engagement') || '[]');
    existingData.push({
      modelId,
      ...engagementData
    });
    localStorage.setItem('buyer_engagement', JSON.stringify(existingData));

    if (onEngagement) {
      onEngagement(engagementData);
    }

    toast({
      title: "Access granted!",
      description: `You can now ${action} this model.`,
    });

    setIsSubmitting(false);
    setIsOpen(false);
  };

  const ActionButton = ({ action, icon: Icon, label, description }: {
    action: 'preview' | 'download' | 'license';
    icon: any;
    label: string;
    description: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={action === 'preview' ? 'outline' : 'default'} className="w-full">
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Access Required
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <img 
              src={previewImage} 
              alt={modelName}
              className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
            />
            <h3 className="font-semibold">{modelName}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Details Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  placeholder="e.g., India, USA, Europe"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="intendedUse">Intended Use</Label>
                <Input
                  id="intendedUse"
                  placeholder="e.g., Prototyping, Production, Education"
                  value={formData.intendedUse}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedUse: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Automotive, Medical, Consumer"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSubmit(action)}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : `Access ${label}`}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Your data helps us improve recommendations and pricing.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-2">
      {isPreview ? (
        <div className="relative">
          <img 
            src={previewImage} 
            alt={modelName}
            className="w-full h-48 object-cover rounded-lg blur-sm"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <ActionButton 
              action="preview"
              icon={Eye}
              label="View Full Preview"
              description="View high-quality preview and details"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <ActionButton 
            action="download"
            icon={Download}
            label="Download"
            description="Download the 3D model files"
          />
          <ActionButton 
            action="license"
            icon={User}
            label="License"
            description="Get commercial license"
          />
        </div>
      )}
    </div>
  );
};
