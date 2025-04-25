import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kiểm tra kết nối database
    await prisma.$connect();
    console.log('✅ Kết nối database thành công!');

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Không thể kết nối đến database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Xử lý sự kiện đóng ứng dụng
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('👋 Server đã đóng kết nối');
  process.exit(0);
});

startServer(); 