import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Model {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[];
}

interface EditModelModalProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
  onModelUpdated: (updatedModel: Model) => void;
}

export const EditModelModal = ({ model, isOpen, onClose, onModelUpdated }: EditModelModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Mechanical",
    "Architecture", 
    "Medical",
    "Automotive",
    "Electronics",
    "Jewelry",
    "Toys",
    "Art",
    "Tools",
    "Other"
  ];

  useEffect(() => {
    if (model) {
      setName(model.name);
      setDescription(model.description || "");
      setCategory(model.category || "");
      setTags(model.tags || []);
    }
  }, [model]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!model || !name.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('models')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          category: category || null,
          tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', model.id)
        .select()
        .single();

      if (error) throw error;

      const updatedModel = {
        ...model,
        name: data.name,
        description: data.description,
        category: data.category,
        tags: data.tags
      };

      onModelUpdated(updatedModel);
      toast.success('Model updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error('Failed to update model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (model) {
      setName(model.name);
      setDescription(model.description || "");
      setCategory(model.category || "");
      setTags(model.tags || []);
    }
    setNewTag("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
          <DialogDescription>
            Update your model details and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="model-name">
              Model Name <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="model-name" 
              placeholder="Enter a descriptive name for your model"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={!name.trim() ? "border-destructive" : ""}
            />
            {!name.trim() && (
              <p className="text-sm text-destructive mt-1">Model name is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="model-description">Description</Label>
            <Textarea 
              id="model-description" 
              placeholder="Describe your model, its features, and potential use cases..." 
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="model-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label>Tags</Label>
              <span className="text-xs text-muted-foreground flex items-center">
                <Brain className="h-3 w-3 text-primary mr-1" />
                Custom tags
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-2">
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)} 
                    className="text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom tag..." 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button variant="outline" onClick={handleAddTag} type="button">
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Updating..." : "Update Model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};