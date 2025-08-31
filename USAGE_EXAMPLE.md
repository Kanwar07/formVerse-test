# UnifiedCADViewer Usage Examples

## Basic Usage

```tsx
import React from 'react';
import { UnifiedCADViewer } from '@/components/preview/UnifiedCADViewer';

export const MyComponent = () => {
  const handleClose = () => {
    console.log('Viewer closed');
  };

  return (
    <UnifiedCADViewer
      fileUrl="https://example.com/model.stl"
      fileName="sample_model.stl"
      width={800}
      height={600}
      showControls={true}
      autoRotate={false}
      onClose={handleClose}
    />
  );
};
```

## With File Upload

```tsx
import React, { useState } from 'react';
import { UnifiedCADViewer } from '@/components/preview/UnifiedCADViewer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const FileUploadViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [showViewer, setShowViewer] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    }
  };

  const handleView = () => {
    if (fileUrl) {
      setShowViewer(true);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          accept=".stl,.obj,.gltf,.glb,.ply,.step,.stp,.iges,.ige,.igs"
          onChange={handleFileSelect}
        />
        {file && (
          <Button onClick={handleView} className="mt-2">
            View 3D Model
          </Button>
        )}
      </div>

      {showViewer && fileUrl && file && (
        <UnifiedCADViewer
          fileUrl={fileUrl}
          fileName={file.name}
          width={800}
          height={600}
          showControls={true}
          autoRotate={true}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
};
```

## Integration with Modal Service

```tsx
import React, { useState } from 'react';
import { UnifiedCADViewer } from '@/components/preview/UnifiedCADViewer';
import { getGlbBlobUrl } from '@/utils/cadqua';

export const ModalIntegrationViewer = () => {
  const [taskId, setTaskId] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLoadFromModal = async () => {
    if (!taskId) return;
    
    setLoading(true);
    try {
      // Use the existing CORS-safe proxy utility
      const url = await getGlbBlobUrl(
        taskId, 
        'https://formversedude--cadqua-3d-api-fastapi-app.modal.run'
      );
      setBlobUrl(url);
    } catch (error) {
      console.error('Failed to load from Modal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter Modal task ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />
        <Button onClick={handleLoadFromModal} disabled={loading}>
          {loading ? 'Loading...' : 'Load Model'}
        </Button>
      </div>

      {blobUrl && (
        <UnifiedCADViewer
          fileUrl={blobUrl}
          fileName={`modal_model_${taskId}.glb`}
          width={800}
          height={600}
          showControls={true}
          autoRotate={false}
          onClose={() => setBlobUrl('')}
        />
      )}
    </div>
  );
};
```

## Error Handling Example

```tsx
import React, { useState } from 'react';
import { UnifiedCADViewer } from '@/components/preview/UnifiedCADViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ErrorHandlingViewer = () => {
  const [error, setError] = useState<string | null>(null);

  // The UnifiedCADViewer handles errors internally and shows user-friendly messages
  // But you can also catch errors at the component level if needed

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <UnifiedCADViewer
        fileUrl="https://example.com/potentially-broken-model.stl"
        fileName="test_model.stl"
        width={800}
        height={600}
        showControls={true}
        autoRotate={false}
        // The viewer will handle errors gracefully and show fallback UI
      />
    </div>
  );
};
```

## Supported File Formats

The `UnifiedCADViewer` supports the following formats:

| Format | Extension | Description | Status |
|--------|-----------|-------------|--------|
| STL | `.stl` | Stereolithography | ✅ Full Support |
| OBJ | `.obj` | Wavefront OBJ | ✅ Full Support (with MTL) |
| GLTF | `.gltf` | GL Transmission Format | ✅ Full Support |
| GLB | `.glb` | GL Transmission Format Binary | ✅ Full Support |
| PLY | `.ply` | Polygon File Format | ✅ Full Support |
| STEP | `.step`, `.stp` | Standard for Exchange of Product Data | ⚠️ Representative Geometry |
| IGES | `.iges`, `.ige`, `.igs` | Initial Graphics Exchange Specification | ⚠️ Representative Geometry |

## Props Reference

```typescript
interface UnifiedCADViewerProps {
  fileUrl: string;          // URL to the 3D model file (blob URL or HTTP URL)
  fileName: string;         // Name of the file for display
  fileType?: string;        // Optional file type override
  onClose?: () => void;     // Callback when viewer is closed
  className?: string;       // Additional CSS classes
  width?: number;           // Viewer width in pixels (default: 800)
  height?: number;          // Viewer height in pixels (default: 600)
  showControls?: boolean;   // Show viewer controls (default: true)
  autoRotate?: boolean;     // Auto-rotate the model (default: false)
}
```

## Migration from Old Viewers

If you're currently using any of these components:
- `Enhanced3DViewer`
- `UniversalModelViewer`
- `SimpleSTLViewer`
- `ModelViewer3D`
- `FixedModelViewer`

Replace them with `UnifiedCADViewer`:

```tsx
// OLD
<Enhanced3DViewer 
  modelUrl={url} 
  fileName={name} 
  fileType="stl" 
  width={800} 
  height={600} 
/>

// NEW
<UnifiedCADViewer 
  fileUrl={url} 
  fileName={name} 
  width={800} 
  height={600} 
  showControls={true}
/>
```

The new viewer provides:
- Better error handling
- Consistent UI/UX
- Support for all formats
- Proper React Three Fiber integration
- No more "lov" property errors
- Graceful fallbacks for failed loads
