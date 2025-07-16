import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Zap, CheckCircle, XCircle, Clock } from "lucide-react";

const TestImageToCAD = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const runFullWorkflowTest = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to run the test.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    
    try {
      console.log("=== STARTING FULL WORKFLOW TEST ===");
      
      // Step 1: Test image upload to storage
      setTestResults(prev => [...prev, { step: "Uploading test image", status: "running" }]);
      
      // Create a test image file (1x1 pixel PNG)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const response = await fetch(testImageData);
      const blob = await response.blob();
      const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
      
      const fileName = `test-cad-images/${user.id}/${Date.now()}-test.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(fileName, testFile);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      
      setTestResults(prev => prev.map(item => 
        item.step === "Uploading test image" 
          ? { ...item, status: "success", details: "Image uploaded successfully" }
          : item
      ));

      // Step 2: Test conversion job creation
      setTestResults(prev => [...prev, { step: "Creating conversion job", status: "running" }]);
      
      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(fileName);

      console.log("Test image URL:", publicUrl);

      const { data: jobData, error: jobError } = await supabase.functions.invoke('image-to-cad', {
        body: {
          image_url: publicUrl,
          output_format: 'stl',
          resolution: 128,
          thickness: 2
        }
      });

      console.log("Job creation response:", { jobData, jobError });

      if (jobError) throw new Error(`Job creation failed: ${jobError.message}`);
      
      setTestResults(prev => prev.map(item => 
        item.step === "Creating conversion job" 
          ? { ...item, status: "success", details: `Job created: ${jobData.job_id}` }
          : item
      ));

      // Step 3: Test job status polling
      setTestResults(prev => [...prev, { step: "Testing job status polling", status: "running" }]);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const pollResponse = await fetch(
        `https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/image-to-cad?job_id=${jobData.job_id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Poll response status:", pollResponse.status);

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        throw new Error(`Polling failed: ${pollResponse.status} - ${errorText}`);
      }

      const jobStatus = await pollResponse.json();
      console.log("Job status:", jobStatus);
      
      setTestResults(prev => prev.map(item => 
        item.step === "Testing job status polling" 
          ? { ...item, status: "success", details: `Status: ${jobStatus.status}` }
          : item
      ));

      // Step 4: Wait for processing to complete (simulate a few polls)
      setTestResults(prev => [...prev, { step: "Monitoring conversion progress", status: "running" }]);
      
      let finalStatus = jobStatus;
      let pollCount = 0;
      const maxPolls = 10;
      
      while (finalStatus.status === 'pending' || finalStatus.status === 'processing') {
        if (pollCount >= maxPolls) break;
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        
        const statusResponse = await fetch(
          `https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/image-to-cad?job_id=${jobData.job_id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (statusResponse.ok) {
          finalStatus = await statusResponse.json();
          console.log(`Poll ${pollCount + 1} status:`, finalStatus.status);
        }
        
        pollCount++;
      }
      
      setTestResults(prev => prev.map(item => 
        item.step === "Monitoring conversion progress" 
          ? { 
              ...item, 
              status: finalStatus.status === 'completed' ? "success" : "partial",
              details: `Final status: ${finalStatus.status}${finalStatus.result_url ? ` - File: ${finalStatus.result_url}` : ''}`
            }
          : item
      ));

      console.log("=== TEST COMPLETED ===");
      console.log("Final job status:", finalStatus);

      toast({
        title: "Workflow test completed",
        description: `Test finished with status: ${finalStatus.status}`,
      });

    } catch (error) {
      console.error("Test error:", error);
      
      setTestResults(prev => [...prev, { 
        step: "Test failed", 
        status: "error", 
        details: error instanceof Error ? error.message : "Unknown error"
      }]);
      
      toast({
        title: "Test failed",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to run the workflow test.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Image to CAD Workflow Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the complete conversion workflow to identify any issues
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Workflow Test
          </CardTitle>
          <CardDescription>
            This will test the complete image-to-CAD conversion workflow including upload, job creation, and status polling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={runFullWorkflowTest}
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? "Running Test..." : "Run Full Workflow Test"}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <p className="font-medium">{result.step}</p>
                    {result.details && (
                      <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestImageToCAD;