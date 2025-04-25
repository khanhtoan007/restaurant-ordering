import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middlewares/error.middleware';
import { CreateTableDto, PaginationParams, UpdateTableDto } from '../../types';

const prisma = new PrismaClient();

export const createTable = async (data: CreateTableDto) => {
  // Kiểm tra số bàn đã tồn tại chưa
  const existingTable = await prisma.table.findFirst({
    where: { number: data.number },
  });

  if (existingTable) {
    throw new AppError(`Bàn số ${data.number} đã tồn tại`, 400);
  }

  // Tạo token QR code
  const qrToken = uuidv4();

  return prisma.table.create({
    data: {
      ...data,
      qrToken,
    },
  });
};

export const getTables = async (params: PaginationParams) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;

  const [tables, total] = await Promise.all([
    prisma.table.findMany({
      skip,
      take: limit,
      orderBy: { number: 'asc' },
    }),
    prisma.table.count(),
  ]);

  return {
    data: tables,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getTableById = async (id: string) => {
  return prisma.table.findUnique({
    where: { id },
  });
};

export const getTableByQrToken = async (qrToken: string) => {
  return prisma.table.findUnique({
    where: { qrToken },
  });
};

export const updateTable = async (id: string, data: UpdateTableDto) => {
  // Kiểm tra bàn tồn tại
  const table = await prisma.table.findUnique({
    where: { id },
  });

  if (!table) {
    throw new AppError('Không tìm thấy bàn', 404);
  }

  return prisma.table.update({
    where: { id },
    data,
  });
};

export const deleteTable = async (id: string) => {
  // Kiểm tra bàn có order đang hoạt động không
  const table = await prisma.table.findUnique({
    where: { id },
    include: {
      orders: {
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      }
    },
  });

  if (!table) {
    throw new AppError('Không tìm thấy bàn', 404);
  }

  if (table.isOccupied == true) {
    throw new AppError('Không thể xóa bàn đang có đơn hàng đang hoạt động', 400);
  }

  return prisma.table.delete({
    where: { id },
  });
}; 