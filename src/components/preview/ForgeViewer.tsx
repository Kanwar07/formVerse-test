
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, RotateCcw, ZoomIn, ZoomOut, Move3d, FileText, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { forgeService } from '@/services/forgeService';
import { ModelViewer3D } from './ModelViewer3D';

declare global {
  interface Window {
    Autodesk: any;
  }
}

interface ForgeViewerProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
  onModelInfo?: (info: any) => void;
}

export const ForgeViewer = ({ fileUrl, fileName, fileType, onClose, onModelInfo }: ForgeViewerProps) => {
  const [viewMode, setViewMode] = useState<'3d' | 'file' | 'forge'>('3d');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<any>({
    fileName,
    fileType,
    viewer: 'CAD Viewer'
  });
  const { toast } = useToast();

  useEffect(() => {
    setModelInfo({
      fileName,
      fileType,
      viewer: viewMode === '3d' ? 'Three.js 3D' : viewMode === 'file' ? 'File Viewer' : 'Autodesk Forge'
    });

    if (onModelInfo) {
      onModelInfo({
        fileName,
        fileType,
        viewer: viewMode === '3d' ? 'Three.js 3D' : viewMode === 'file' ? 'File Viewer' : 'Autodesk Forge'
      });
    }
  }, [fileName, fileType, viewMode, onModelInfo]);

  // Check if file is 3D viewable
  const is3DViewable = () => {
    const supported3DFormats = ['stl', 'obj', 'ply', 'gltf', 'glb'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && supported3DFormats.includes(extension);
  };

  // Check if file is CAD format
  const isCADFile = () => {
    const cadFormats = ['step', 'stp', 'iges', 'igs', 'dwg', 'dxf', 'catpart', 'catproduct', 'prt', 'asm'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && cadFormats.includes(extension);
  };

  const handleDownloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Downloading ${fileName}`,
    });
  };

  const renderFileViewer = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20">
        <div className="text-center max-w-md p-6">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">CAD File Viewer</h3>
          <p className="text-muted-foreground mb-4">
            {fileName} ({fileType.toUpperCase()})
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm text-blue-800 font-medium mb-1">File Information:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Name:</strong> {fileName}</div>
                <div><strong>Format:</strong> {fileType.toUpperCase()}</div>
                <div><strong>Status:</strong> Ready for download</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownloadFile} className="flex-1">
                Download & View
              </Button>
              {is3DViewable() && (
                <Button variant="outline" onClick={() => setViewMode('3d')}>
                  <Eye className="h-4 w-4 mr-2" />
                  3D View
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            Professional CAD files can be viewed in specialized software
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (viewMode === '3d' && is3DViewable()) {
      return (
        <ModelViewer3D
          fileUrl={fileUrl}
          fileName={fileName}
          fileType={fileType}
          onClose={() => setViewMode('file')}
          onModelInfo={onModelInfo}
        />
      );
    }
    
    return renderFileViewer();
  };

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0 h-full relative">
        {/* Header Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Preview
          </Button>
          <Badge variant="secondary">
            {viewMode === '3d' ? '3D Viewer' : 'File Viewer'}
          </Badge>
        </div>
        
        {/* View Mode Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {is3DViewable() && (
            <Button 
              variant={viewMode === '3d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('3d')}
            >
              <Move3d className="h-4 w-4 mr-1" />
              3D
            </Button>
          )}
          <Button 
            variant={viewMode === 'file' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('file')}
          >
            <FileText className="h-4 w-4 mr-1" />
            File
          </Button>
        </div>

        {/* Model Info */}
        {modelInfo && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-xs max-w-xs">
            <div className="flex items-center mb-2">
              <Move3d className="h-4 w-4 mr-2" />
              <span className="font-medium">File Info</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileType.toUpperCase()}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div><strong>Viewer:</strong> {modelInfo.viewer}</div>
              {isCADFile() && <div><strong>Type:</strong> Professional CAD</div>}
            </div>
          </div>
        )}

        {/* Main Content */}
        {viewMode === '3d' && !is3DViewable() ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium">3D Preview Not Available</p>
              <p className="text-sm text-muted-foreground mb-4">
                This file format doesn't support 3D preview
              </p>
              <Button variant="outline" onClick={() => setViewMode('file')}>
                View File Details
              </Button>
            </div>
          </div>
        ) : (
          renderContent()
        )}

        {/* Controls Help */}
        {viewMode === '3d' && is3DViewable() && (
          <div className="absolute bottom-4 left-4 z-10 bg-background/90 rounded-md p-2">
            <p className="text-xs text-muted-foreground">
              Drag to rotate • Scroll to zoom • Right-click to pan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
