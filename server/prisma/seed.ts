import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Tạo tài khoản admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: adminPassword,
      name:   'Admin',
      role: UserRole.ADMIN,
    },
  });

  // Tạo tài khoản servicer
  const servicerPassword = await bcrypt.hash('servicer123', 10);
  await prisma.user.upsert({
    where: { email: 'servicer@restaurant.com' },
    update: {},
    create: {
      email: 'servicer@restaurant.com',
      password: servicerPassword,
      name: 'Servicer',
      role: UserRole.SERVICER,
    },
  });

  // Tạo categories
  const categories = [
    {
      name: 'Món Chính',
      description: 'Các món ăn chính của nhà hàng',
      order: 1,
    },
    {
      name: 'Khai Vị',
      description: 'Các món ăn khai vị',
      order: 2,
    },
    {
      name: 'Đồ Uống',
      description: 'Các loại đồ uống',
      order: 3,
    },
    {
      name: 'Ăn Vặt',
      description: 'Các loại đồ ăn vặt',
      order: 4,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Tạo menu items
  const menuItems = [
    {
      name: 'Phở Bò',
      description: 'Phở bò truyền thống với thịt bò tái, bò viên và nước dùng đậm đà',
      price: 45000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Món Chính' } }))?.id || '',
      image: 'https://example.com/pho-bo.jpg',
      inStock: true,
    },
    {
      name: 'Bún Bò Huế',
      description: 'Bún bò Huế với thịt bò, giò heo và nước dùng cay nồng',
      price: 50000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Món Chính' } }))?.id || '',
      image: 'https://example.com/bun-bo-hue.jpg',
      inStock: true,
    },
    {
      name: 'Cơm Tấm Sườn',
      description: 'Cơm tấm với sườn nướng, bì, chả và trứng ốp la',
      price: 55000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Món Chính' } }))?.id || '',
      image: 'https://example.com/com-tam.jpg',
      inStock: true,
    },
    {
      name: 'Gỏi Cuốn',
      description: 'Gỏi cuốn tôm thịt với rau sống và nước chấm đặc trưng',
      price: 35000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Khai Vị' } }))?.id || '',
      image: 'https://example.com/goi-cuon.jpg',
      inStock: true,
    },
    {
      name: 'Chả Giò',
      description: 'Chả giò giòn rụm với nhân thịt heo và tôm',
      price: 40000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Khai Vị' } }))?.id || '',
      image: 'https://example.com/cha-gio.jpg',
      inStock: true,
    },
    {
      name: 'Sinh Tố Bơ',
      description: 'Sinh tố bơ thơm ngon, béo ngậy',
      price: 30000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/sinh-to-bo.jpg',
      inStock: true,
    },
    {
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê đen pha với sữa đặc và đá',
      price: 17000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/ca-phe-sua-da.jpg',
      inStock: true,
    },
    {
      name: 'Espresso',
      description: 'Espresso đậm đà, thơm ngon',
      price: 15000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/ca-phe-sua-da.jpg',
      inStock: true,
    },
    {
      name: 'Bạc Xỉu',
      description: 'Bạc xỉu đậm đà, thơm ngon',
      price: 25000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/ca-phe-sua-da.jpg',
      inStock: true,
    },
    {
      name: 'Latte Nóng/Lạnh',
      description: 'Latte đậm đà, thơm ngon',
      price: 25000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/ca-phe-sua-da.jpg',
      inStock: true,
    },
    {
      name: 'Nước ép Chanh',
      description: 'Nước ép chanh đậm đà, thơm ngon',
      price: 25000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/tra-da.jpg',
      inStock: true,
    },
    {
      name: 'Nước cam tươi',
      description: 'Nước cam tươi đậm đà, thơm ngon',
      price: 25000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/tra-da.jpg',
      inStock: true,
    },
    {
      name: 'Nước ép dưa hấu',
      description: 'Nước ép dưa hấu đậm đà, thơm ngon',
      price: 25000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/tra-da.jpg',
      inStock: true,
    },
    {
      name: 'Trà Đá',
      description: 'Trà đá mát lạnh',
      price: 3000,
      categoryId: (await prisma.category.findUnique({ where: { name: 'Đồ Uống' } }))?.id || '',
      image: 'https://example.com/tra-da.jpg',
      inStock: true,
    },
  ];

  for (const item of menuItems) {
    if (!item) continue;
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  const tables = [
    {
      name: 'Phòng VIP 1',
      capacity: 4,
      qrToken: '1234567890',
      isOccupied: false,
    },
    {
      name: 'Phòng VIP 2-3',
      capacity: 4,
      qrToken: '1234567891',
      isOccupied: false,
    },
    {
      name: 'Bàn 3',
      capacity: 4,
      qrToken: '1234567892',
      isOccupied: false,
    },
    {
      name: 'Bàn 4',
      capacity: 4,
      qrToken: '1234567893',
      isOccupied: false,
    },
    {
      name: 'Bàn 5',
      capacity: 4,
      qrToken: '1234567894',
      isOccupied: false,
    },
  ];

  for (const table of tables) {
    if (!table) continue;
    await prisma.table.upsert({
      where: { qrToken: table.qrToken },
      update: {},
      create: table,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 