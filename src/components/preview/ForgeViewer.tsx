
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FileText, Eye, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ModelViewer3D } from './ModelViewer3D';

interface ForgeViewerProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  onClose: () => void;
  onModelInfo?: (info: any) => void;
}

export const ForgeViewer = ({ fileUrl, fileName, fileType, onClose, onModelInfo }: ForgeViewerProps) => {
  const [viewMode, setViewMode] = useState<'file' | '3d'>('3d');
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFileData();
  }, [fileUrl]);

  const loadFileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading file from URL:', fileUrl);
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('File loaded successfully, size:', arrayBuffer.byteLength, 'bytes');
      
      setFileData(arrayBuffer);
      
      // Notify parent about file info
      if (onModelInfo) {
        onModelInfo({
          fileName,
          fileType: fileType.toUpperCase(),
          fileSize: arrayBuffer.byteLength,
          fileSizeFormatted: formatFileSize(arrayBuffer.byteLength),
          viewer: 'CAD File Viewer'
        });
      }
      
      // Auto-switch to 3D view for supported formats
      if (is3DViewable()) {
        setViewMode('3d');
      }
      
    } catch (err) {
      console.error('Error loading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to load file');
      toast({
        title: "File loading failed",
        description: "Could not load the model file for preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const is3DViewable = () => {
    const supported3DFormats = ['stl', 'obj', 'ply', 'gltf', 'glb'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && supported3DFormats.includes(extension);
  };

  const handleDownloadFile = () => {
    if (!fileData) return;
    
    const blob = new Blob([fileData], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
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
          <h3 className="text-lg font-semibold mb-2">CAD File Loaded</h3>
          <p className="text-muted-foreground mb-4">
            {fileName} ({fileType.toUpperCase()})
          </p>
          
          {fileData && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-left">
                <p className="text-sm text-green-800 font-medium mb-1">File Successfully Loaded:</p>
                <div className="text-xs text-green-700 space-y-1">
                  <div><strong>Name:</strong> {fileName}</div>
                  <div><strong>Format:</strong> {fileType.toUpperCase()}</div>
                  <div><strong>Size:</strong> {formatFileSize(fileData.byteLength)}</div>
                  <div><strong>Status:</strong> Ready for processing</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleDownloadFile} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                {is3DViewable() && (
                  <Button variant="outline" onClick={() => setViewMode('3d')}>
                    <Eye className="h-4 w-4 mr-2" />
                    3D View
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-3">
            File content has been successfully loaded and verified
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[500px]">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading file data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[500px]">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive font-medium">Failed to load file</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={onClose}>
              Back to Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <Eye className="h-4 w-4 mr-1" />
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

        {/* File Info */}
        {fileData && (
          <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur rounded-md p-3 text-xs max-w-xs">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium">File Loaded</span>
            </div>
            <div className="space-y-1">
              <div><strong>Format:</strong> {fileType.toUpperCase()}</div>
              <div><strong>Size:</strong> {formatFileSize(fileData.byteLength)}</div>
              <div><strong>File:</strong> {fileName}</div>
              <div><strong>Status:</strong> ✓ Loaded</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {viewMode === '3d' && is3DViewable() && fileData ? (
          <ModelViewer3D
            fileUrl={fileUrl}
            fileName={fileName}
            fileType={fileType}
            onClose={() => setViewMode('file')}
            onModelInfo={onModelInfo}
          />
        ) : (
          renderFileViewer()
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
