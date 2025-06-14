
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { forgeService } from '@/services/forgeService';
import { useToast } from '@/components/ui/use-toast';

export const ForgeSetup = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleSaveCredentials = async () => {
    if (!clientId || !clientSecret) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Client ID and Client Secret",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      forgeService.setCredentials({ clientId, clientSecret });
      
      // Test the credentials
      await forgeService.getAccessToken();
      
      setIsConfigured(true);
      toast({
        title: "Forge configured successfully!",
        description: "Professional CAD viewer is now available",
      });
    } catch (error) {
      console.error('Error configuring Forge:', error);
      toast({
        title: "Configuration failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2" />
          Autodesk Forge Setup
          {isConfigured && <Badge variant="default" className="ml-2">Configured</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Why Autodesk Forge?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Industry-standard CAD file viewer</li>
            <li>• Supports 100+ file formats (STEP, STL, SolidWorks, etc.)</li>
            <li>• Exact geometry representation with materials</li>
            <li>• Professional features: sectioning, measurements, animations</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">1. Create Autodesk Forge Application</h4>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://forge.autodesk.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Forge Portal
              </a>
            </Button>
            <span className="text-sm text-muted-foreground">Create a new app with Data Management & Model Derivative APIs</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">2. Enter Your Forge Credentials</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                type="text"
                placeholder="Your Forge Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Your Forge Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            {isConfigured ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Ready to view CAD models
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                Configuration required
              </>
            )}
          </div>
          <Button 
            onClick={handleSaveCredentials}
            disabled={testing || isConfigured}
          >
            {testing ? 'Testing...' : isConfigured ? 'Configured' : 'Save & Test'}
          </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-800 mb-2">Security Note</h4>
          <p className="text-sm text-amber-700">
            In production, store Forge credentials securely on your backend server. 
            This demo stores them in browser memory for testing purposes only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
