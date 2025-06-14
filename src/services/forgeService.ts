
// Autodesk Forge Service
// This service handles authentication and file operations for the Forge Viewer

export interface ForgeCredentials {
  clientId: string;
  clientSecret: string;
}

export interface ForgeTranslationJob {
  urn: string;
  status: 'pending' | 'inprogress' | 'success' | 'failed';
  progress: string;
}

export class ForgeService {
  private credentials: ForgeCredentials | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials?: ForgeCredentials) {
    this.credentials = credentials || null;
  }

  // Set Forge credentials
  setCredentials(credentials: ForgeCredentials) {
    this.credentials = credentials;
  }

  // Get access token for Forge API
  async getAccessToken(): Promise<string> {
    if (!this.credentials) {
      throw new Error('Forge credentials not set');
    }

    // Check if token is still valid
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
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          grant_type: 'client_credentials',
          scope: 'data:read data:write data:create bucket:create bucket:read viewables:read'
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Forge access token:', error);
      throw error;
    }
  }

  // Upload file to Forge and get URN
  async uploadFile(file: File, bucketKey: string): Promise<string> {
    const token = await this.getAccessToken();
    
    try {
      // Create bucket if it doesn't exist
      await this.createBucket(bucketKey, token);

      // Upload file to bucket
      const objectKey = encodeURIComponent(file.name);
      const uploadResponse = await fetch(
        `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectKey}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/octet-stream',
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const uploadData = await uploadResponse.json();
      return uploadData.objectId;
    } catch (error) {
      console.error('Error uploading file to Forge:', error);
      throw error;
    }
  }

  // Create bucket for file storage
  private async createBucket(bucketKey: string, token: string): Promise<void> {
    try {
      const response = await fetch('https://developer.api.autodesk.com/oss/v2/buckets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketKey: bucketKey,
          policyKey: 'temporary'
        })
      });

      // Bucket might already exist, which is fine
      if (response.status === 409) {
        console.log('Bucket already exists');
        return;
      }

      if (!response.ok) {
        throw new Error(`Bucket creation failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  // Start model translation job
  async translateModel(urn: string): Promise<ForgeTranslationJob> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch('https://developer.api.autodesk.com/modelderivative/v2/designdata/job', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            urn: urn
          },
          output: {
            formats: [
              {
                type: 'svf',
                views: ['2d', '3d']
              }
            ]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        urn: urn,
        status: 'pending',
        progress: '0%'
      };
    } catch (error) {
      console.error('Error starting model translation:', error);
      throw error;
    }
  }

  // Check translation status
  async getTranslationStatus(urn: string): Promise<ForgeTranslationJob> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch(
        `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        urn: urn,
        status: data.status.toLowerCase(),
        progress: data.progress || '0%'
      };
    } catch (error) {
      console.error('Error checking translation status:', error);
      throw error;
    }
  }

  // Convert Base64 URN for Forge
  base64encode(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

// Export singleton instance
export const forgeService = new ForgeService();
