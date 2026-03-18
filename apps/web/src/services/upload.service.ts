import api from './api';

interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export async function getUploadSignature(folder = 'prepsync'): Promise<UploadSignature> {
  const { data } = await api.post('/upload/signature', { folder });
  return data;
}

/**
 * Upload a file directly to Cloudinary using signed upload.
 * Returns the secure URL and public ID.
 */
export async function uploadFile(
  file: File,
  folder = 'prepsync',
): Promise<{ url: string; publicId: string; filename: string; filesize: number }> {
  // Get signed params from our backend
  const sig = await getUploadSignature(folder);

  // Build form data for Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  // Upload directly to Cloudinary
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    throw new Error('File upload failed');
  }

  const result = await res.json();

  return {
    url: result.secure_url,
    publicId: result.public_id,
    filename: file.name,
    filesize: file.size,
  };
}
