// Autodesk Forge Service for 3D Model Viewing
// This service handles authentication and model translation for Forge Viewer

interface ForgeCredentials {
  clientId: string;
  clientSecret: string;
}

interface ForgeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class ForgeService {
  private credentials: ForgeCredentials | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Set Forge credentials
  setCredentials(credentials: ForgeCredentials) {
    this.credentials = credentials;
    this.accessToken = null; // Reset token when credentials change
    this.tokenExpiry = 0;
  }

  // Check if credentials are configured
  hasCredentials(): boolean {
    return !!(this.credentials?.clientId && this.credentials?.clientSecret);
  }

  // Get access token (with caching)
  async getAccessToken(): Promise<string> {
    if (!this.hasCredentials()) {
      throw new Error('Forge credentials not configured');
    }

    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.credentials!.clientId,
          client_secret: this.credentials!.clientSecret,
          grant_type: 'client_credentials',
          scope: 'data:read data:write data:create bucket:create bucket:read viewables:read'
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const data: ForgeTokenResponse = await response.json();
      
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Forge access token:', error);
      throw error;
    }
  }

  // Upload file to Forge (placeholder - needs implementation)
  async uploadFile(file: File): Promise<string> {
    // This would implement the Data Management API upload process
    // 1. Create/get bucket
    // 2. Upload file to bucket
    // 3. Return object URN
    throw new Error('File upload not implemented. This requires backend implementation for security.');
  }

  // Translate model to viewable format (placeholder)
  async translateModel(urn: string): Promise<string> {
    // This would implement the Model Derivative API translation
    // 1. Submit translation job
    // 2. Poll for completion
    // 3. Return viewable URN
    throw new Error('Model translation not implemented. This requires backend implementation.');
  }

  // Get model status
  async getModelStatus(urn: string): Promise<string> {
    if (!this.hasCredentials()) {
      throw new Error('Forge credentials not configured');
    }

    const token = await this.getAccessToken();
    
    const response = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get model status: ${response.status}`);
    }

    const data = await response.json();
    return data.status;
  }
}

export const forgeService = new ForgeService();
