import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mặc định lỗi server
  let statusCode = 500;
  let message = 'Lỗi máy chủ';
  let stack = process.env.NODE_ENV === 'production' ? {} : err.stack;

  // Nếu là AppError đã được xử lý
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Ghi log lỗi trong môi trường phát triển
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack }),
  });
}; 