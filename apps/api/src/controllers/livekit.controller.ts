import { Request, Response, NextFunction } from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { ApiError } from '../middleware/error';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';

export async function getLiveKitToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) throw ApiError.unauthorized();

    const { roomName } = req.params;
    if (!roomName) throw ApiError.badRequest('Room name is required');

    // Create a new AccessToken
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: user._id.toString(),
      name: user.name,
    });

    // Add permissions for the specific room
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    res.json({ token });
  } catch (error) {
    next(error);
  }
}
