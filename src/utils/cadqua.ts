// Helper utility for getting CAD model files via proxy to avoid CORS issues

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbnp4cGJ0aGxkZnFxYnp6amN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MzIxNzgsImV4cCI6MjA2NDUwODE3OH0.7YWUyL31eeOtauM4TqHjQXm8PB1Y-wVB7Cj0dSMQ0SA';

export async function getGlbBlobUrl(taskId: string, apiBaseUrl: string, supabaseAnonKey?: string) {
  const res = await fetch(
    'https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/modal-image-to-cad?action=download',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_id: taskId, file_type: 'glb', api_base_url: apiBaseUrl }),
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Proxy download failed: ${res.status} - ${errorText}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob); // Use this blob URL for viewer + thumbnail
}

export async function getGlbObjectUrl(taskId: string, apiBaseUrl: string, supabaseAnonKey: string) {
  return getGlbBlobUrl(taskId, apiBaseUrl, supabaseAnonKey);
}

export async function getVideoObjectUrl(taskId: string, apiBaseUrl: string, supabaseAnonKey: string) {
  const res = await fetch(
    'https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/modal-image-to-cad?action=download',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_id: taskId, file_type: 'video', api_base_url: apiBaseUrl }),
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Proxy download failed: ${res.status} - ${errorText}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob); // blob URL for video preview
}