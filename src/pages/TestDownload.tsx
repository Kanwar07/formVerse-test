import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APIService } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const TestDownload = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to test the download system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/auth">Sign In / Sign Up</Link>
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Create an account or sign in to test model downloads.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const testDownload = async () => {
    setLoading(true);
    try {
      console.log('Starting download test for user:', user?.email);
      
      // Use the test model and license we created
      const modelId = 'b2d4865d-041e-40c1-800e-4ae1eb5f8818'; // MAIN CLOUSER PTS
      
      // Get the model license
      const { data: license } = await supabase
        .from('model_licenses')
        .select('*')
        .eq('model_id', modelId)
        .eq('license_type_id', 'e3fb40c4-51a7-42d2-b768-5c60be04d0de') // Personal license
        .single();

      if (!license) {
        throw new Error('License not found');
      }

      console.log('Found license:', license);

      // Generate download token
      const token = await APIService.generateDownloadToken(modelId, license.id);
      console.log('Generated token:', token);
      
      // Create download URL using secure download function
      const downloadUrl = `https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/secure-download/${token}`;
      console.log('Download URL:', downloadUrl);
      
      // Test the download endpoint
      const response = await fetch(downloadUrl);
      console.log('Download response:', response);
      
      if (response.ok) {
        // If it's a redirect, follow it
        if (response.redirected) {
          window.open(response.url, '_blank');
        } else {
          // Direct download
          window.open(downloadUrl, '_blank');
        }
        
        toast({
          title: "Download test successful!",
          description: "The download system is working correctly.",
        });
      } else {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Download test error:', error);
      toast({
        title: "Download test failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Download System Test</CardTitle>
          <CardDescription>
            Test the backend download functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testDownload} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testing..." : "Test Download"}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This will test the secure download system with the MAIN CLOUSER PTS model.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDownload;