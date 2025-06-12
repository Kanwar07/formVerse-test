import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Download, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModelPreviewProps {
  modelName: string;
  thumbnail: string;
  isOwner?: boolean;
  isPurchased?: boolean;
  price?: number;
  onPurchase?: () => void;
  onPreviewClick?: () => void;
}

export const ModelPreview = ({ 
  modelName, 
  thumbnail, 
  isOwner = false, 
  isPurchased = false,
  price,
  onPurchase,
  onPreviewClick
}: ModelPreviewProps) => {
  const [showWatermark, setShowWatermark] = useState(!isOwner && !isPurchased);

  const handlePreviewToggle = () => {
    if (onPreviewClick) {
      onPreviewClick();
    }
    if (!isOwner && !isPurchased) {
      // Keep watermark for non-owners who haven't purchased
      return;
    }
    setShowWatermark(!showWatermark);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative group">
          <img 
            src={thumbnail} 
            alt={modelName}
            className={`w-full aspect-square object-cover transition-all duration-300 ${
              showWatermark && !isOwner && !isPurchased ? 'blur-sm' : ''
            }`}
          />
          
          {/* Watermark overlay for non-owners */}
          {showWatermark && !isOwner && !isPurchased && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl font-bold opacity-60 transform rotate-12 mb-2">
                  PREVIEW
                </div>
                <div className="text-sm opacity-80">
                  FormIQ Marketplace
                </div>
                <Lock className="h-8 w-8 mx-auto mt-2 opacity-60" />
              </div>
            </div>
          )}
          
          {/* Action overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handlePreviewToggle}
              >
                {showWatermark && !isOwner && !isPurchased ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {isOwner ? 'Toggle View' : 'Hide Preview'}
                  </>
                )}
              </Button>
              
              {!isOwner && !isPurchased && price && (
                <Button 
                  size="sm"
                  onClick={onPurchase}
                >
                  Buy ₹{price}
                </Button>
              )}
              
              {(isOwner || isPurchased) && (
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2">{modelName}</h3>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {isOwner && <Badge variant="secondary">Your Model</Badge>}
              {isPurchased && !isOwner && <Badge variant="outline">Purchased</Badge>}
              {!isOwner && !isPurchased && <Badge variant="destructive">Preview</Badge>}
            </div>
            {price && !isOwner && (
              <span className="font-bold text-lg">₹{price}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
