import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/error';

// Cloudinary config (set in env)
const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

// ===== POST /upload/signature — Generate signed upload params =====
export async function getUploadSignature(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) throw ApiError.unauthorized();

    if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw ApiError.badRequest('File upload is not configured');
    }

    const { folder = 'prepsync' } = req.body as { folder?: string };
    const timestamp = Math.round(Date.now() / 1000);

    // Create signature for Cloudinary signed upload
    const crypto = await import('crypto');
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    res.json({
      signature,
      timestamp,
      cloudName: CLOUDINARY_CLOUD,
      apiKey: CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    next(error);
  }
}
