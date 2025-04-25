import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../../middlewares/error.middleware';
import { CreateUserDto, LoginUserDto, PaginationParams } from '../../types';
import { generateToken, generateRefreshToken } from '../../utils/token.utils';

const prisma = new PrismaClient();

export const createUser = async (data: CreateUserDto): Promise<User> => {
  // Kiểm tra email đã tồn tại
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email đã được sử dụng', 400);
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // Tạo user mới
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const login = async (data: LoginUserDto) => {
  // Tìm user theo email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  // Tạo token
  const token = generateToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken,
  };
};

export const getUsers = async (params: PaginationParams) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    pagination: {
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: string, data: Partial<CreateUserDto>): Promise<User> => {
  // Nếu cập nhật mật khẩu, mã hóa mật khẩu
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
}; 