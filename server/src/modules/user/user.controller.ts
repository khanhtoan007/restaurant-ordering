import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { AppError } from '../../middlewares/error.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.createUser(req.body);
    
    // Không trả về mật khẩu
    const { password, ...userData } = newUser;
    
    res.status(201).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUsers({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return next(new AppError('Không tìm thấy người dùng', 404));
    }
    
    // Không trả về mật khẩu
    const { password, ...userData } = user;
    
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    // Không trả về mật khẩu
    const { password, ...userData } = user;
    
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}; 