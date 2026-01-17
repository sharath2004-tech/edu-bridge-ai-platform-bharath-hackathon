/**
 * Upload file to Bunny.net with automatic fallback for large files
 * - Small files (<4MB): Upload through Vercel API
 * - Large files (>=4MB): Direct upload to Bunny.net
 */

const MAX_VERCEL_SIZE = 4 * 1024 * 1024; // 4MB

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // For small files, use the regular API route
    if (file.size < MAX_VERCEL_SIZE) {
      return await uploadViaVercel(file, onProgress);
    }
    
    // For large files, use direct upload to Bunny.net
    return await uploadDirectToBunny(file, onProgress);
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
}

/**
 * Upload via Vercel API (for small files)
 */
async function uploadViaVercel(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve) => {
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else if (xhr.status === 413) {
        // Fallback to direct upload if file is too large
        console.log('File too large for Vercel, switching to direct upload...');
        uploadDirectToBunny(file, onProgress).then(resolve);
      } else {
        const response = JSON.parse(xhr.responseText);
        resolve({ success: false, error: response.error || 'Upload failed' });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ success: false, error: 'Network error during upload' });
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}

/**
 * Upload directly to Bunny.net (for large files)
 */
async function uploadDirectToBunny(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log(`📦 Large file detected (${(file.size / 1024 / 1024).toFixed(2)}MB), using direct upload...`);

    // Step 1: Get signed URL from our API
    const signedUrlResponse = await fetch('/api/upload/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!signedUrlResponse.ok) {
      const error = await signedUrlResponse.json();
      return { success: false, error: error.error || 'Failed to get upload URL' };
    }

    const { uploadUrl, cdnUrl, apiKey } = await signedUrlResponse.json();

    // Step 2: Upload directly to Bunny.net
    const xhr = new XMLHttpRequest();

    return new Promise((resolve) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('✅ Direct upload successful:', cdnUrl);
          resolve({ success: true, url: cdnUrl });
        } else {
          console.error('❌ Direct upload failed:', xhr.status, xhr.statusText);
          resolve({ success: false, error: `Upload failed: ${xhr.statusText}` });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({ success: false, error: 'Network error during direct upload' });
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('AccessKey', apiKey);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.send(file);
    });
  } catch (error: any) {
    console.error('Direct upload error:', error);
    return { success: false, error: error.message || 'Direct upload failed' };
  }
}
