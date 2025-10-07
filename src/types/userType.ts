// types/userType.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'reception' | 'user';
  status: 'active' | 'inactive';
  phone?: string;
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  temporaryPassword?: string;
  phone?: string;
  specialization?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: 'active' | 'inactive';
  phone?: string;
  specialization?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: 'newest' | 'oldest';
}