import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VFusion3DService } from "@/services/vfusion3d";
import { useToast } from "@/hooks/use-toast";

export function ConversionTest() {
  const [isTestingConnectivity, setIsTestingConnectivity] = useState(false);
  const [isTestingConversion, setIsTestingConversion] = useState(false);
  const { toast } = useToast();

  const testConnectivity = async () => {
    setIsTestingConnectivity(true);
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (response.ok) {
        toast({
          title: "Connectivity Test Passed",
          description: "Edge function connectivity is working.",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Connectivity Test Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsTestingConnectivity(false);
    }
  };

  const testSampleConversion = async () => {
    setIsTestingConversion(true);
    try {
      // Create a simple test blob with sample image URL
      const testBlob = new Blob(['test'], { type: 'image/jpeg' });
      const testFile = new File([testBlob], 'test.jpg', { type: 'image/jpeg' });
      
      const response = await VFusion3DService.convertImageTo3D(testFile, 'test-user');
      
      toast({
        title: "Sample Conversion Started",
        description: `Prediction ID: ${response.predictionId}`,
      });
      
    } catch (error) {
      toast({
        title: "Sample Conversion Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsTestingConversion(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>System Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnectivity}
          disabled={isTestingConnectivity}
          variant="outline"
          className="w-full"
        >
          {isTestingConnectivity ? "Testing..." : "Test Connectivity"}
        </Button>
        
        <Button 
          onClick={testSampleConversion}
          disabled={isTestingConversion}
          variant="outline" 
          className="w-full"
        >
          {isTestingConversion ? "Testing..." : "Test Sample Conversion"}
        </Button>
      </CardContent>
    </Card>
  );
}