import { Router } from 'express';
import * as tableController from './table.controller';
import { authorize, authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Route công khai để khách hàng truy cập bằng QR code
router.get('/qr/:qrToken', tableController.getTableByQrToken);
router.post('/:tableId/order', tableController.createOrderByTable);

// Routes được bảo vệ - cần xác thực
router.use(authenticate);

// Routes dành cho quản lý bàn
router.get('/', tableController.getTables);
router.get('/:id', tableController.getTableById);

// Routes chỉ dành cho admin
router.use(authorize(['ADMIN']));
router.post('/', tableController.createTable);
router.patch('/:id', tableController.updateTable);
router.delete('/:id', tableController.deleteTable);

export default router; 