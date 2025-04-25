import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import * as tableService from '../table/table.service';
import { AppError } from '../../middlewares/error.middleware';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder(req.body);
    
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.findAll();
    
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.findOne(req.params.id);
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.update(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.remove(req.params.id);
    
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
