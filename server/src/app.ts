import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import tableRoutes from './modules/table/table.routes';
import menuRoutes from './modules/menu/menu.routes';
import orderRoutes from './modules/order/order.routes';
// import invoiceRoutes from './modules/invoice/invoice.routes';
import userRoutes from './modules/user/user.routes';
import { errorHandler } from './middlewares/error.middleware';

// Tải cấu hình môi trường
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware xử lý lỗi
app.use(errorHandler);

export default app; 