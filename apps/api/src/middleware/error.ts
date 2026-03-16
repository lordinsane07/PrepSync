import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (statusCode === 500) {
    console.error('[Error]', err.stack || err.message);
  }

  res.status(statusCode).json({
    error: statusCode === 500
      ? 'An unexpected error occurred'
      : err.message,
    code,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Resource not found',
    code: 'NOT_FOUND',
  });
}

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }

  static badRequest(message: string, code = 'BAD_REQUEST'): ApiError {
    return new ApiError(message, 400, code);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(message, 401, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN'): ApiError {
    return new ApiError(message, 403, code);
  }

  static notFound(message = 'Not found', code = 'NOT_FOUND'): ApiError {
    return new ApiError(message, 404, code);
  }

  static tooMany(message = 'Too many requests', code = 'RATE_LIMITED'): ApiError {
    return new ApiError(message, 429, code);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR'): ApiError {
    return new ApiError(message, 500, code);
  }
}
