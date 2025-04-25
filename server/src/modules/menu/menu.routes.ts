import { Router } from 'express';
import * as menuController from './menu.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
const router = Router();

// Routes công khai
router.get('/', menuController.getMenuItems);
router.get('/table/:tableId', menuController.getMenuItemsByTable);
router.get('/categories', menuController.getMenuCategories);
router.get('/:id', menuController.getMenuItemById);

// Routes được bảo vệ - cần xác thực
router.use(authenticate);

// Routes dành cho quản lý menu
router.post('/', authorize(['ADMIN']), menuController.createMenuItem);
router.patch('/:id', authorize(['ADMIN']), menuController.updateMenuItem);
router.delete('/:id', authorize(['ADMIN']), menuController.deleteMenuItem);

export default router; 