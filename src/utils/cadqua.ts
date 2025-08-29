// Helper utility for getting CAD model files via proxy to avoid CORS issues

export async function getGlbObjectUrl(taskId: string, apiBaseUrl: string, supabaseAnonKey: string) {
  const res = await fetch(
    'https://zqnzxpbthldfqqbzzjct.supabase.co/functions/v1/modal-image-to-cad?action=download',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_id: taskId, file_type: 'glb', api_base_url: apiBaseUrl }),
    }
  );
  if (!res.ok) throw new Error(`Proxy download failed: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob); // blob URL for viewer/thumbnail
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
  if (!res.ok) throw new Error(`Proxy download failed: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob); // blob URL for video preview
}