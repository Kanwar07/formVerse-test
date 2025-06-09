
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, DollarSign, Users } from "lucide-react";

export const ProjectBrief = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    timeline: "",
    skills: [] as string[],
    attachments: [] as File[],
    deliverables: {
      cadFiles: false,
      technicalDrawings: false,
      stlFiles: false,
      materialSpecs: false,
      assemblyInstructions: false
    }
  });
  const { toast } = useToast();

  const skillOptions = [
    "3D Modeling", "CAD Design", "Mechanical Engineering", "Product Design", 
    "Automotive", "Medical Devices", "Consumer Products", "Industrial Design",
    "Prototyping", "Manufacturing", "3D Printing", "Stress Analysis"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleDeliverableChange = (key: keyof typeof formData.deliverables) => {
    setFormData(prev => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        [key]: !prev.deliverables[key]
      }
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Store project brief
    const projectBrief = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'open',
      proposals: 0
    };

    const existingBriefs = JSON.parse(localStorage.getItem('project_briefs') || '[]');
    existingBriefs.push(projectBrief);
    localStorage.setItem('project_briefs', JSON.stringify(existingBriefs));

    toast({
      title: "Project Brief Posted!",
      description: "Your project has been posted. Creators will start sending proposals soon.",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      budget: "",
      timeline: "",
      skills: [],
      attachments: [],
      deliverables: {
        cadFiles: false,
        technicalDrawings: false,
        stlFiles: false,
        materialSpecs: false,
        assemblyInstructions: false
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Project Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Custom Automotive Bracket Design"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="medical">Medical Devices</SelectItem>
                  <SelectItem value="consumer">Consumer Products</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-2500">Under ₹2,500</SelectItem>
                  <SelectItem value="2500-5000">₹2,500 - ₹5,000</SelectItem>
                  <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                  <SelectItem value="over-25000">Over ₹25,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail. Include specifications, requirements, constraints, and any reference materials..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3-days">1-3 days</SelectItem>
                <SelectItem value="1-week">1 week</SelectItem>
                <SelectItem value="2-weeks">2 weeks</SelectItem>
                <SelectItem value="1-month">1 month</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillOptions.map((skill) => (
                <Badge
                  key={skill}
                  variant={formData.skills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Expected Deliverables</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {Object.entries(formData.deliverables).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={() => handleDeliverableChange(key as keyof typeof formData.deliverables)}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button variant="outline" className="flex-1">Save as Draft</Button>
            <Button onClick={handleSubmit} className="flex-1">Post Project</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="flex flex-col items-center gap-1">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Receive Proposals</span>
              <span className="text-muted-foreground">Get quotes from qualified creators</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">Track Progress</span>
              <span className="text-muted-foreground">Monitor project milestones</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium">Secure Payment</span>
              <span className="text-muted-foreground">Escrow-protected transactions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
