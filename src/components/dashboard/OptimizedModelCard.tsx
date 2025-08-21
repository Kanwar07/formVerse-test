import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Model3DThumbnail } from '@/components/dashboard/Model3DThumbnail';
import { 
  Eye, 
  Download, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  BarChart3,
  ExternalLink 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface OptimizedModelCardProps {
  model: {
    id: string;
    name: string;
    preview_image?: string | null;
    file_path?: string;
    price?: number;
    downloads?: number;
    view_count?: number;
    status?: string;
    quality_status?: string;
    is_published?: boolean;
    created_at?: string;
    printability_score?: number;
    tags?: string[];
  };
  onEdit?: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  onTogglePublish?: (modelId: string, isPublished: boolean) => void;
  className?: string;
}

export const OptimizedModelCard: React.FC<OptimizedModelCardProps> = ({
  model,
  onEdit,
  onDelete,
  onTogglePublish,
  className = ""
}) => {
  const getStatusBadge = () => {
    if (!model.is_published) {
      return <Badge variant="secondary">Draft</Badge>;
    }
    
    if (model.quality_status === 'approved') {
      return <Badge variant="default">Published</Badge>;
    }
    
    if (model.quality_status === 'reviewing') {
      return <Badge variant="outline">Under Review</Badge>;
    }
    
    if (model.quality_status === 'declined') {
      return <Badge variant="destructive">Declined</Badge>;
    }
    
    return <Badge variant="outline">Unpublished</Badge>;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Free';
    return `₹${price}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="aspect-square relative">
          {model.file_path ? (
            <Model3DThumbnail
              modelId={model.id}
              filePath={model.file_path}
              className="w-full h-full cursor-pointer"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-xs text-muted-foreground">No preview</div>
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/model/${model.id}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
                
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(model.id)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Model
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {onTogglePublish && (
                  <DropdownMenuItem 
                    onClick={() => onTogglePublish(model.id, !model.is_published)}
                  >
                    {model.is_published ? 'Unpublish' : 'Publish'}
                  </DropdownMenuItem>
                )}
                
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(model.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Model Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {model.name}
            </h3>
            
            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {model.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {model.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{model.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{model.view_count || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{model.downloads || 0} downloads</span>
            </div>
          </div>

          {/* Price and Quality Score */}
          <div className="flex items-center justify-between">
            <div className="font-semibold text-primary">
              {formatPrice(model.price)}
            </div>
            
            {model.printability_score && (
              <div className="text-xs text-muted-foreground">
                Quality: {model.printability_score}/100
              </div>
            )}
          </div>

          {/* Upload Date */}
          {model.created_at && (
            <div className="text-xs text-muted-foreground">
              Created {formatDate(model.created_at)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};