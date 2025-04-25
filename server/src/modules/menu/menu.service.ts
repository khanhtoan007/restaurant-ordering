import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';
import { CreateMenuItemDto, PaginationParams, UpdateMenuItemDto } from '../../types';

const prisma = new PrismaClient();

export const createMenuItem = async (data: CreateMenuItemDto) => {
  return prisma.menuItem.create({
    data: {
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    },
  });
};

export const getMenuItems = async (params: PaginationParams & { category?: string, inStock?: boolean }) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  // Lọc theo category nếu có
  if (params.category) {
    where.category = params.category;
  }

  // Lọc theo inStock nếu có
  if (params.inStock !== undefined) {
    where.inStock = params.inStock === true;
  }

  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { category: 'asc' },
    }),
    prisma.menuItem.count({ where }),
  ]);

  return {
    data: items,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getMenuCategories = async () => {
  const categories = await prisma.menuItem.groupBy({
    by: ['category'],
  });

  return categories.map((item: any) => item.category);
};

export const getMenuItemById = async (id: string) => {
  return prisma.menuItem.findUnique({
    where: { id },
  });
};

export const updateMenuItem = async (id: string, data: UpdateMenuItemDto) => {
  // Kiểm tra món tồn tại
  const item = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!item) {
    throw new AppError('Không tìm thấy món', 404);
  }

  // Xử lý trường price nếu là string
  if (data.price && typeof data.price === 'string') {
    data.price = parseFloat(data.price);
  }

  return prisma.menuItem.update({
    where: { id },
    data,
  });
};

export const deleteMenuItem = async (id: string) => {
  // Kiểm tra món có đang được đặt trong order nào không
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      orderItems: {
        where: {
          order: {
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
        },
      },
    },
  });

  if (!item) {
    throw new AppError('Không tìm thấy món', 404);
  }

  if (item.orderItems.length > 0) {
    throw new AppError('Không thể xóa món đang được đặt trong đơn hàng', 400);
  }

  return prisma.menuItem.delete({
    where: { id },
  });
}; 