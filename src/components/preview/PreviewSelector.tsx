import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Lock, Box } from 'lucide-react';
import { SimpleSTLViewer } from './SimpleSTLViewer';

interface PreviewSelectorProps {
  modelName: string;
  thumbnail: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  isOwner?: boolean;
  isPurchased?: boolean;
  price?: number;
  onPurchase?: () => void;
  className?: string;
}

export const PreviewSelector = ({ 
  modelName, 
  thumbnail, 
  fileUrl,
  fileName,
  fileType,
  isOwner = false, 
  isPurchased = false,
  price,
  onPurchase,
  className = ""
}: PreviewSelectorProps) => {
  const canView3D = isOwner || isPurchased;
  const hasFileAccess = fileUrl && fileName && fileType;
  const [background, setBackground] = useState<'white' | 'grey' | 'black' | 'gradient'>('gradient');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">3D Model Preview</h3>
          <Badge variant="default" className="ml-2 text-xs bg-primary">Interactive</Badge>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 flex-wrap">
        {isOwner && <Badge variant="secondary">Your Model</Badge>}
        {isPurchased && !isOwner && <Badge variant="outline">Purchased</Badge>}
        {!isOwner && !isPurchased && <Badge variant="destructive">Preview Mode</Badge>}
        {canView3D && <Badge variant="default" className="bg-primary">3D Viewer Active</Badge>}
        {fileType && <Badge variant="outline">{fileType.toUpperCase()}</Badge>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Background</span>
        <Select value={background} onValueChange={(v) => setBackground(v as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="grey">Grey</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 3D Viewer Content */}
      {hasFileAccess && canView3D ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <SimpleSTLViewer fileUrl={fileUrl!} background={background} />
          </div>
          
          {/* User Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Use touch or mouse to rotate. Pinch or scroll to zoom in/out.</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg aspect-square flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">3D Viewer Locked</p>
            <p className="text-sm text-muted-foreground">
              {!canView3D ? 'Purchase required for 3D preview' : 'Model file not available'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isOwner && !isPurchased && price && (
        <div className="flex gap-2">
          <Button onClick={onPurchase} className="flex-1">
            Buy for ₹{price}
          </Button>
        </div>
      )}
    </div>
  );
};