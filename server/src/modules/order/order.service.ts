import { PrismaClient, OrderStatus } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';
import { CreateOrderDto, UpdateOrderDto } from '../../types';

const prisma = new PrismaClient();

export const createOrder = async (data: CreateOrderDto) => {
  const { tableId, items } = data;

  // Kiểm tra bàn có tồn tại không
  const table = await prisma.table.findUnique({
    where: { id: tableId },
  });

  if (!table) {
    throw new AppError('Không tìm thấy bàn', 404);
  }

  // Kiểm tra bàn đã có order đang hoạt động chưa
  const activeOrder = await prisma.order.findFirst({
    where: {
      tableId,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  if (activeOrder) {
    throw new AppError('Bàn đã có đơn hàng đang hoạt động', 400);
  }

  // Tạo order
  const order = await prisma.order.create({
    data: {
      tableId,
      status: 'PENDING',
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
        })),
      },
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });

  return order;
};

export const findAll = async () => {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });
};

export const findOne = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  return order;
};

export const update = async (id: string, data: UpdateOrderDto) => {
  const { tableId, items } = data;

  // Kiểm tra order có tồn tại không
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  // Nếu có tableId, kiểm tra bàn có tồn tại không
  if (tableId) {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new AppError('Không tìm thấy bàn', 404);
    }
  }

  // Cập nhật order
  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(tableId && { tableId }),
      ...(items && {
        items: {
          deleteMany: {},
          create: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      }),
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });

  return order;
};

export const remove = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  if (order.status !== 'PENDING') {
    throw new AppError('Chỉ có thể xóa đơn hàng ở trạng thái chờ xác nhận', 400);
  }

  return prisma.order.delete({
    where: { id },
  });
};

export const updateStatus = async (id: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });
}; 