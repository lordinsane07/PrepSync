import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/error';

// ===== GET /users/me =====
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized();
    }
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
}

// ===== PATCH /users/me =====
export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized();
    }

    const allowedFields = ['name', 'avatarUrl', 'goal', 'targetDomains', 'weeklyGoal'];
    const updates = Object.keys(req.body);
    const invalidFields = updates.filter((f) => !allowedFields.includes(f));

    if (invalidFields.length > 0) {
      throw ApiError.badRequest(`Cannot update: ${invalidFields.join(', ')}`);
    }

    for (const field of updates) {
      if (allowedFields.includes(field)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any)[field] = req.body[field];
      }
    }

    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
}
