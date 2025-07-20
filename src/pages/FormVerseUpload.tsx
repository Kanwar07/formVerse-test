import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, Loader2, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Enhanced3DViewer } from '../components/three/Enhanced3DViewer';
import { useToast } from '../hooks/use-toast';

interface FileData {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'analyzing' | 'complete' | 'error';
  analysis?: {
    vertices: number;
    faces: number;
    dimensions: { x: number; y: number; z: number };
    volume: number;
    surfaceArea: number;
    fileSize: string;
  };
}

const SUPPORTED_FORMATS = ['.stl', '.obj', '.gltf', '.glb', '.ply'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function FormVerseUpload() {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeFile = useCallback(async (file: File): Promise<FileData['analysis']> => {
    // Simulate file analysis with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      vertices: Math.floor(Math.random() * 50000) + 10000,
      faces: Math.floor(Math.random() * 100000) + 20000,
      dimensions: {
        x: Math.round((Math.random() * 200 + 50) * 100) / 100,
        y: Math.round((Math.random() * 200 + 50) * 100) / 100,
        z: Math.round((Math.random() * 100 + 20) * 100) / 100,
      },
      volume: Math.round((Math.random() * 1000 + 100) * 100) / 100,
      surfaceArea: Math.round((Math.random() * 5000 + 1000) * 100) / 100,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    };
  }, []);

  const processFile = useCallback(async (file: File) => {
    const fileData: FileData = {
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading',
    };

    setUploadedFile(fileData);
    setIsAnalyzing(true);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFile(prev => prev ? { ...prev, progress: i } : null);
    }

    // Start analysis
    setUploadedFile(prev => prev ? { ...prev, status: 'analyzing' } : null);

    try {
      const analysis = await analyzeFile(file);
      setUploadedFile(prev => prev ? { 
        ...prev, 
        status: 'complete', 
        analysis 
      } : null);
      
      toast({
        title: "Analysis Complete",
        description: "Your 3D model has been successfully analyzed and is ready for preview.",
      });
    } catch (error) {
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeFile, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
      toast({
        title: "Unsupported File Format",
        description: `Please upload a file with one of these formats: ${SUPPORTED_FORMATS.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    processFile(file);
  }, [processFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'model/obj': ['.obj'],
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/ply': ['.ply'],
    },
    multiple: false,
  });

  const getStatusIcon = (status: FileData['status']) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: FileData['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'analyzing':
        return 'Analyzing model...';
      case 'complete':
        return 'Analysis complete';
      case 'error':
        return 'Analysis failed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
              </div>
              <h1 className="text-2xl font-bold matrix-text">FormVerse</h1>
            </div>
            <Badge variant="secondary" className="elegant-glass">
              CAD Upload Studio
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Upload Area */}
          <div className="space-y-6">
            <Card className="elegant-glass border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload CAD Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                    transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center
                    ${isDragActive 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }
                  `}
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto ${isDragActive ? 'animate-glow-pulse' : ''}`}>
                      <Upload className={`w-8 h-8 text-primary ${isDragActive ? 'animate-bounce' : ''}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Drop your CAD file here' : 'Drag & drop your CAD file'}
                      </p>
                      <p className="text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {SUPPORTED_FORMATS.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format.toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Maximum file size: 50MB
                    </p>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="mt-6 space-y-4">
                    <div className="elegant-glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(uploadedFile.status)}
                          <div>
                            <p className="font-medium truncate max-w-[200px]">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getStatusText(uploadedFile.status)}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={uploadedFile.status === 'complete' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {uploadedFile.status}
                        </Badge>
                      </div>

                      {uploadedFile.status === 'uploading' && (
                        <Progress value={uploadedFile.progress} className="w-full" />
                      )}

                      {uploadedFile.status === 'analyzing' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Analyzing geometry...</span>
                            <span>Processing</span>
                          </div>
                          <Progress value={undefined} className="w-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    {uploadedFile.status === 'complete' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Inspect
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - 3D Viewer */}
          <div className="space-y-6">
            <Card className="elegant-glass border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileType className="w-5 h-5 text-primary" />
                  3D Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                {uploadedFile && uploadedFile.status === 'complete' ? (
                  <div className="h-full rounded-xl overflow-hidden elegant-glass">
                    <Enhanced3DViewer
                      modelFile={uploadedFile.file}
                      fileName={uploadedFile.file.name}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="h-full rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                        <FileType className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">
                          {uploadedFile ? 'Processing model...' : 'No model uploaded'}
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          {uploadedFile ? 'Please wait while we analyze your file' : 'Upload a CAD file to see the 3D preview'}
                        </p>
                      </div>
                      {isAnalyzing && (
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Panel - Analysis Results */}
        {uploadedFile?.analysis && (
          <Card className="elegant-glass border-border/50 mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Model Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {uploadedFile.analysis.vertices.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Vertices</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {uploadedFile.analysis.faces.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Faces</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {uploadedFile.analysis.volume}
                  </p>
                  <p className="text-sm text-muted-foreground">Volume (cm³)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {uploadedFile.analysis.surfaceArea}
                  </p>
                  <p className="text-sm text-muted-foreground">Surface Area (cm²)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {uploadedFile.analysis.fileSize}
                  </p>
                  <p className="text-sm text-muted-foreground">File Size</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">
                    {uploadedFile.analysis.dimensions.x} × {uploadedFile.analysis.dimensions.y} × {uploadedFile.analysis.dimensions.z}
                  </p>
                  <p className="text-sm text-muted-foreground">Dimensions (mm)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}