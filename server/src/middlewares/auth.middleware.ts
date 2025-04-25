import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from './error.middleware';

const prisma = new PrismaClient();

// Mở rộng kiểu Request để thêm thuộc tính user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Không tìm thấy token xác thực', 401));
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Kiểm tra user có tồn tại không
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AppError('Token không hợp lệ hoặc người dùng không tồn tại', 401));
    }

    // Gắn user vào request
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Token không hợp lệ', 401));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Vui lòng đăng nhập', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện hành động này', 403));
    }

    next();
  };
}; 