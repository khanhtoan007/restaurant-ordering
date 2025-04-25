import express from 'express';
import * as orderController from './order.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// Protected routes
router.use(authenticate);

// Staff routes
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.updateOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

// Admin routes
router.delete('/:id', authorize(['ADMIN']), orderController.deleteOrder);

export default router; 