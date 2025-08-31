import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Eye } from 'lucide-react';
import { UnifiedCADViewer } from './UnifiedCADViewer';
import { useToast } from '@/hooks/use-toast';

/**
 * Demo component to test the UnifiedCADViewer with various file formats
 * This component helps debug and demonstrate the fixed 3D viewer functionality
 */
export const CADViewerDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [showViewer, setShowViewer] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  
  const { toast } = useToast();

  // Supported file formats
  const supportedFormats = [
    { ext: 'STL', mime: 'application/sla', description: 'Stereolithography' },
    { ext: 'OBJ', mime: 'text/plain', description: 'Wavefront OBJ' },
    { ext: 'GLTF', mime: 'model/gltf+json', description: 'GL Transmission Format' },
    { ext: 'GLB', mime: 'model/gltf-binary', description: 'GL Transmission Format Binary' },
    { ext: 'PLY', mime: 'application/octet-stream', description: 'Polygon File Format' },
    { ext: 'STEP', mime: 'application/step', description: 'Standard for Exchange of Product Data' },
    { ext: 'IGES', mime: 'application/iges', description: 'Initial Graphics Exchange Specification' }
  ];

  // Sample model URLs for testing
  const sampleModels = [
    {
      name: 'Sample Cube (STL)',
      url: 'https://threejs.org/examples/models/stl/ascii/slotted_disk.stl',
      fileName: 'sample_cube.stl'
    },
    {
      name: 'Sample Model (OBJ)',
      url: 'https://threejs.org/examples/models/obj/male02/male02.obj',
      fileName: 'sample_model.obj'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      const supportedExts = supportedFormats.map(f => f.ext.toLowerCase());
      
      if (!extension || !supportedExts.includes(extension)) {
        toast({
          variant: "destructive",
          title: "Unsupported File Format",
          description: `Please select a file with one of these extensions: ${supportedExts.join(', ')}`
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setShowViewer(false);

      toast({
        title: "File Selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      });
    }
  };

  const handleCustomUrl = () => {
    if (!customUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL"
      });
      return;
    }

    // Extract filename from URL
    const urlParts = customUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'model';
    
    setSelectedFile(null);
    setFileUrl(customUrl);
    setShowViewer(false);

    toast({
      title: "Custom URL Set",
      description: fileName
    });
  };

  const handleSampleModel = (sample: typeof sampleModels[0]) => {
    setSelectedFile(null);
    setFileUrl(sample.url);
    setShowViewer(false);

    toast({
      title: "Sample Model Loaded",
      description: sample.name
    });
  };

  const handleViewModel = () => {
    if (!fileUrl) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file or enter a URL first"
      });
      return;
    }

    setShowViewer(true);
  };

  const getFileName = () => {
    if (selectedFile) return selectedFile.name;
    if (customUrl) {
      const urlParts = customUrl.split('/');
      return urlParts[urlParts.length - 1] || 'model';
    }
    if (fileUrl) {
      const urlParts = fileUrl.split('/');
      return urlParts[urlParts.length - 1] || 'model';
    }
    return 'unknown';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">CAD Viewer Demo</h1>
        <p className="text-muted-foreground">
          Test the unified 3D model viewer with various CAD file formats
        </p>
      </div>

      {/* File Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select a CAD file</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".stl,.obj,.gltf,.glb,.ply,.step,.stp,.iges,.ige,.igs"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>
            
            {selectedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {selectedFile.name.split('.').pop()?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Custom URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="custom-url">Enter model URL</Label>
              <Input
                id="custom-url"
                type="url"
                placeholder="https://example.com/model.stl"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleCustomUrl} className="w-full">
              Load from URL
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sample Models */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleModels.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSampleModel(sample)}
                className="justify-start"
              >
                {sample.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {supportedFormats.map((format, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <Badge className="mb-2">{format.ext}</Badge>
                <p className="text-xs text-muted-foreground">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Button */}
      {fileUrl && !showViewer && (
        <div className="text-center">
          <Button onClick={handleViewModel} size="lg" className="gap-2">
            <Eye className="h-4 w-4" />
            View 3D Model
          </Button>
        </div>
      )}

      {/* 3D Viewer */}
      {showViewer && fileUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">3D Model Viewer</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowViewer(false)}
            >
              Close Viewer
            </Button>
          </div>
          
          <UnifiedCADViewer
            fileUrl={fileUrl}
            fileName={getFileName()}
            width={800}
            height={600}
            showControls={true}
            autoRotate={false}
            onClose={() => setShowViewer(false)}
          />
        </div>
      )}
    </div>
  );
};
