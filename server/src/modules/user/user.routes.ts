import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Routes công khai
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes được bảo vệ - cần xác thực
router.use(authenticate);

// Routes dành cho admin
router.use(authorize(['ADMIN']));
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router; 