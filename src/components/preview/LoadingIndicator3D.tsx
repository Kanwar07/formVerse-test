import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

export const LoadingIndicator3D = () => {
  const { progress, item } = useProgress();
  
  return (
    <Html center>
      <div className="bg-background/95 backdrop-blur rounded-lg p-6 border shadow-lg min-w-[200px]">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-medium">Loading CAD Model</p>
          <p className="text-sm text-muted-foreground">
            {progress.toFixed(0)}% complete
          </p>
          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {item && (
            <p className="text-xs text-muted-foreground">
              Loading: {item}
            </p>
          )}
        </div>
      </div>
    </Html>
  );
};