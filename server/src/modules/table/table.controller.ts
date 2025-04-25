import { Request, Response, NextFunction } from 'express';
import * as tableService from './table.service';
import * as orderService from '../order/order.service';
import { AppError } from '../../middlewares/error.middleware';

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await tableService.createTable(req.body);
    
    res.status(201).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const getTables = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tableService.getTables({
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

export const getTableById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await tableService.getTableById(req.params.id);
    
    if (!table) {
      return next(new AppError('Không tìm thấy bàn', 404));
    }
    
    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const getTableByQrToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await tableService.getTableByQrToken(req.params.qrToken);
    
    if (!table) {
      return next(new AppError('Mã QR không hợp lệ', 404));
    }
    
    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await tableService.updateTable(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tableService.deleteTable(req.params.id);
    
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const createOrderByTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra bàn có tồn tại không
    const table = await tableService.getTableById(req.params.tableId);
    if (!table) {
      return next(new AppError('Không tìm thấy bàn', 404));
    }

    // Tạo order với tableId từ params
    const order = await orderService.createOrder({
      ...req.body,
      tableId: req.params.tableId,
    });
    
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}; 