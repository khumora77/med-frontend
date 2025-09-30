// types/user.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'reception' | 'user';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'reception' | 'user';
  temporaryPassword: string;
}

export interface UpdateRoleDto {
  role: 'admin' | 'doctor' | 'reception' | 'user';
}

export interface UpdateStatusDto {
  status: 'active' | 'inactive' | 'banned';
}

export interface ListUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: ListUsersDto;
}