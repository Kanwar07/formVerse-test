
import { useEffect, useRef } from "react";

interface WatermarkCanvasProps {
  imageUrl: string;
  watermarkText?: string;
  onWatermarkedImage?: (dataUrl: string) => void;
  className?: string;
}

export const WatermarkCanvas = ({ 
  imageUrl, 
  watermarkText = "FormIQ Preview", 
  onWatermarkedImage,
  className = ""
}: WatermarkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark
      const fontSize = Math.min(img.width, img.height) * 0.08;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Save context for rotation
      ctx.save();
      
      // Move to center and rotate
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 6); // -30 degrees
      
      // Draw watermark text with stroke and fill
      ctx.strokeText(watermarkText, 0, 0);
      ctx.fillText(watermarkText, 0, 0);
      
      // Add smaller subtitle
      ctx.font = `${fontSize * 0.4}px Arial`;
      ctx.strokeText('Marketplace', 0, fontSize * 0.8);
      ctx.fillText('Marketplace', 0, fontSize * 0.8);
      
      // Restore context
      ctx.restore();
      
      // Add multiple smaller watermarks
      ctx.font = `${fontSize * 0.3}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      
      for (let x = 0; x < img.width; x += img.width / 4) {
        for (let y = 0; y < img.height; y += img.height / 4) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 8);
          ctx.fillText('FormIQ', 0, 0);
          ctx.restore();
        }
      }
      
      // Callback with watermarked image data
      if (onWatermarkedImage) {
        onWatermarkedImage(canvas.toDataURL('image/jpeg', 0.9));
      }
    };
    
    img.src = imageUrl;
  }, [imageUrl, watermarkText, onWatermarkedImage]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`max-w-full h-auto ${className}`}
      style={{ display: 'block' }}
    />
  );
};
