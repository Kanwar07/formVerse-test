import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, FileImage, Settings, CheckCircle, XCircle, Clock, Zap } from "lucide-react";

interface ConversionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  image_url: string;
  result_url?: string;
  error_message?: string;
  parameters?: {
    output_format: 'stl' | 'step';
    resolution: number;
    thickness: number;
  };
  created_at: string;
}

const ImageToCAD = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<'stl' | 'step'>('stl');
  const [resolution, setResolution] = useState([128]);
  const [thickness, setThickness] = useState([2]);
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const uploadAndConvert = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select an image and make sure you're logged in",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Supabase storage
      const fileName = `cad-images/${user.id}/${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(fileName);

      // Start conversion job
      console.log('Starting conversion with:', { 
        image_url: publicUrl, 
        output_format: outputFormat, 
        resolution: resolution[0], 
        thickness: thickness[0] 
      });
      
      const { data, error } = await supabase.functions.invoke('image-to-cad', {
        body: {
          image_url: publicUrl,
          output_format: outputFormat,
          resolution: resolution[0],
          thickness: thickness[0]
        }
      });

      console.log('Conversion response:', { data, error });

      if (error) throw error;

      toast({
        title: "Conversion Started",
        description: "Your image is being converted to CAD. This may take a few minutes.",
      });

      // Add job to list and start polling
      const newJob: ConversionJob = {
        id: data.job_id,
        status: 'pending',
        image_url: publicUrl,
        parameters: {
          output_format: outputFormat,
          resolution: resolution[0],
          thickness: thickness[0]
        },
        created_at: new Date().toISOString()
      };

      setJobs(prev => [newJob, ...prev]);
      pollJobStatus(data.job_id);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");

    } catch (error) {
      console.error('Upload/conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: "Failed to start conversion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Call edge function with proper URL parameters and auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          console.error('No access token available for polling');
          clearInterval(pollInterval);
          return;
        }
        
        console.log('Polling job status for:', jobId);
        
        const response = await fetch(
          `https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/image-to-cad?job_id=${jobId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Polling response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Polling error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedJob = await response.json();
        console.log('Updated job status:', updatedJob);
        setJobs(prev => 
          prev.map(job => 
            job.id === jobId ? updatedJob : job
          )
        );

        if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
          clearInterval(pollInterval);
          
          if (updatedJob.status === 'completed') {
            toast({
              title: "Conversion Complete",
              description: "Your CAD file is ready for download!",
            });
          } else {
            toast({
              title: "Conversion Failed",
              description: updatedJob.error_message || "Unknown error occurred",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
      }
    }, 2000);

    // Clear interval after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const downloadCADFile = (job: ConversionJob) => {
    if (job.result_url) {
      window.open(job.result_url, '_blank');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to use the Image to CAD converter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Image to CAD Converter</h1>
          <p className="text-muted-foreground mt-2">
            Convert your 2D images to 3D CAD models using AI-powered GenCAD technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Upload an image to convert to a 3D CAD model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PNG, JPG, JPEG, WEBP
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile?.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Conversion Settings
              </CardTitle>
              <CardDescription>
                Configure the output parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Output Format */}
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={(value: 'stl' | 'step') => setOutputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stl">STL (3D Printing)</SelectItem>
                    <SelectItem value="step">STEP (CAD Design)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution */}
              <div className="space-y-2">
                <Label>Resolution: {resolution[0]}px</Label>
                <Slider
                  value={resolution}
                  onValueChange={setResolution}
                  max={512}
                  min={64}
                  step={64}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Higher resolution = better quality, longer processing time
                </p>
              </div>

              {/* Thickness */}
              <div className="space-y-2">
                <Label>Model Thickness: {thickness[0]}mm</Label>
                <Slider
                  value={thickness}
                  onValueChange={setThickness}
                  max={10}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Convert Button */}
              <Button 
                onClick={uploadAndConvert}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isUploading ? "Converting..." : "Convert to CAD"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Section */}
        {jobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Conversion Jobs</CardTitle>
              <CardDescription>
                Track your image-to-CAD conversion progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={job.image_url}
                        alt="Source"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.parameters?.output_format?.toUpperCase()} • {job.parameters?.resolution}px
                        </p>
                        {job.error_message && (
                          <p className="text-sm text-red-500 mt-1">{job.error_message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {job.status === 'processing' && (
                        <Progress value={50} className="w-24" />
                      )}
                      {job.status === 'completed' && job.result_url && (
                        <Button
                          onClick={() => downloadCADFile(job)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ImageToCAD;