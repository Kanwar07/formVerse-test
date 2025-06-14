
import { Card, CardContent } from "@/components/ui/card";
import { PreviewSelector } from "./PreviewSelector";

interface ModelPreviewProps {
  modelName: string;
  thumbnail: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  isOwner?: boolean;
  isPurchased?: boolean;
  price?: number;
  onPurchase?: () => void;
  onPreviewClick?: () => void;
}

export const ModelPreview = ({ 
  modelName, 
  thumbnail, 
  fileUrl,
  fileName,
  fileType,
  isOwner = false, 
  isPurchased = false,
  price,
  onPurchase,
  onPreviewClick
}: ModelPreviewProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <PreviewSelector
          modelName={modelName}
          thumbnail={thumbnail}
          fileUrl={fileUrl}
          fileName={fileName}
          fileType={fileType}
          isOwner={isOwner}
          isPurchased={isPurchased}
          price={price}
          onPurchase={onPurchase}
        />
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">{modelName}</h3>
          {price && !isOwner && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Starting at</span>
              <span className="font-bold text-lg">₹{price}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
