import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  modelDownloadUrl?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ModelViewerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ModelViewer Error Boundary caught an error:', error, errorInfo);
    
    // Log specific Three.js/React Three Fiber errors
    if (error.message.includes('lov') || error.message.includes('Cannot read properties')) {
      console.error('Detected Three.js property access error, likely due to invalid 3D model data or CORS issues');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border rounded-lg bg-muted/20">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              3D model preview failed to load due to a technical error. This is likely due to CORS restrictions or invalid model data.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Error:</strong> {this.state.error?.message || 'Unknown error'}</p>
              <p className="mt-2">The 3D model was generated successfully, but the preview cannot be displayed due to browser security restrictions.</p>
            </div>
            
            <div className="flex gap-2">
              {this.props.modelDownloadUrl && (
                <Button 
                  onClick={() => window.open(this.props.modelDownloadUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Model
                </Button>
              )}
              
              {this.props.onRetry && (
                <Button 
                  variant="outline" 
                  onClick={this.props.onRetry}
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
