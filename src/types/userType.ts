// types/userType.ts
export interface User {
  id: string;
  email: string;
  firstName: string; // Backendda firstname
  lastName: string;  // Backendda lastname  
  role: 'admin' | 'doctor' | 'reception' | 'user';
  status: 'active' | 'inactive' | 'banned'; // Backendda isActive
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string; // Backend firstname ga o'tadi
  lastName: string;  // Backend lastname ga o'tadi
  role: 'admin' | 'doctor' | 'reception' | 'user';
  temporaryPassword: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string; // Backend firstname ga o'tadi
  lastName?: string;  // Backend lastname ga o'tadi
  role?: 'admin' | 'doctor' | 'reception' | 'user';
  status?: 'active' | 'inactive' | 'banned'; // Backend isActive ga o'tadi
}