import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Calendar,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UnifiedCADViewer } from '../preview/UnifiedCADViewer';

interface Model {
  id: string;
  name: string;
  description: string;
  preview_image: string | null;
  price: number;
  downloads: number;
  view_count: number;
  status: string;
  quality_status: string;
  is_published: boolean;
  created_at: string;
  printability_score: number;
  tags: string[];
  file_path?: string;
  file_type?: string;
}

interface UnifiedModelCardProps {
  model: Model;
  canEdit?: boolean;
  onEdit?: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  onTogglePublish?: (modelId: string, isPublished: boolean) => void;
  onClick?: (modelId: string) => void;
  isUpdating?: boolean;
}

export const UnifiedModelCard: React.FC<UnifiedModelCardProps> = ({
  model,
  canEdit = false,
  onEdit,
  onDelete,
  onTogglePublish,
  onClick,
  isUpdating = false
}) => {
  const [viewerError, setViewerError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, label, input, [role="switch"]')) {
      return;
    }
    
    if (onClick) {
      onClick(model.id);
    }
  };

  const getModelFileUrl = () => {
    if (!model.file_path) return '';
    
    // Handle different URL patterns
    if (model.file_path.startsWith('http')) {
      return model.file_path;
    }
    
    // Supabase storage URL
    return `https://zqnzxpbthldfqqbzzjct.supabase.co/storage/v1/object/public/3d-models/${model.file_path}`;
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* 3D Model Viewer */}
        <div className="aspect-square relative bg-muted">
          {model.file_path && !viewerError ? (
            <UnifiedCADViewer
              fileUrl={getModelFileUrl()}
              fileName={model.name || 'model'}
              fileType={model.file_type}
              width={400}
              height={400}
              showControls={false}
              autoRotate={true}
              className="border-0"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {model.preview_image ? (
                <img 
                  src={model.preview_image} 
                  alt={model.name}
                  className="w-full h-full object-cover"
                  onError={() => setViewerError(true)}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No preview available</p>
                </div>
              )}
            </div>
          )}
          
          {/* Status Badge */}
          <Badge 
            className={`absolute top-2 left-2 text-xs ${getStatusColor(model.status)}`}
          >
            {model.status}
          </Badge>
          
          {/* Price Badge */}
          {model.price > 0 && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              ₹{model.price}
            </Badge>
          )}
          
          {/* Publish Toggle */}
          {canEdit && onTogglePublish && (
            <div 
              className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 rounded-md px-2 py-1 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-medium">
                {model.is_published ? "Published" : "Unpublished"}
              </span>
              <Switch
                checked={model.is_published}
                onCheckedChange={(checked) => onTogglePublish(model.id, checked)}
                onClick={(e) => e.stopPropagation()}
                disabled={isUpdating}
                className="scale-75"
              />
            </div>
          )}
        </div>
        
        {/* Model Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg truncate flex-1 group-hover:text-primary transition-colors">
              {model.name}
            </h3>
            
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(model.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(model.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {model.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {model.description}
            </p>
          )}
          
          {/* Tags */}
          {model.tags && model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {model.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {model.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{model.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {model.view_count || 0}
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              {model.downloads || 0}
            </div>
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(model.created_at).toLocaleDateString()}
            </div>
          </div>
          
          {/* Printability Score */}
          {model.printability_score > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Printability</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${model.printability_score >= 80 ? 'bg-green-100 text-green-800' : 
                  model.printability_score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}
              >
                {model.printability_score}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};