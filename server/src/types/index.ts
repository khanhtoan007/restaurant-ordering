import { UserRole } from '@prisma/client';


// Request query params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Request body types
export interface CreateTableDto {
  number: number;
  capacity: number;
}

export interface UpdateTableDto {
  capacity?: number;
  isOccupied?: boolean;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  inStock: boolean;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  inStock?: boolean;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderDto {
  tableId: string;
  items: OrderItem[];
}

export interface UpdateOrderDto {
  tableId?: string;
  items?: OrderItem[];
}

export interface UpdateOrderItemDto {
  quantity?: number;
  notes?: string;
}

export interface CreateInvoiceDto {
  orderId: string;
  total: number;
}

export interface UpdateInvoiceDto {
  isPaid?: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

// Response types
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  token: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
} 