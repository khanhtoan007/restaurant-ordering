import { Request, Response, NextFunction } from 'express';
import * as menuService from './menu.service';
import * as tableService from '../table/table.service';
import { AppError } from '../../middlewares/error.middleware';

export const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await menuService.createMenuItem(req.body);
    
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await menuService.getMenuItems({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      category: req.query.category as string | undefined,
      inStock: req.query.inStock as boolean | undefined,
    });
    
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await menuService.getMenuCategories();
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await menuService.getMenuItemById(req.params.id);
    
    if (!item) {
      return next(new AppError('Không tìm thấy món', 404));
    }
    
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await menuService.updateMenuItem(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const getMenuItemsByTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra bàn có tồn tại không
    const table = await tableService.getTableById(req.params.tableId);
    if (!table) {
      return next(new AppError('Không tìm thấy bàn', 404));
    }

    // Lấy danh sách món ăn
    const result = await menuService.getMenuItems({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      category: req.query.category as string | undefined,
      inStock: req.query.inStock as boolean | undefined,
    });
    
    res.status(200).json({
      success: true,
      table,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}; 