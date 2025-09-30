// service/userApi.ts - ALTERNATIVE VERSION
import { api } from "./api";
import type { CreateUserDto, UpdateUserDto } from "../types/userType";

export const userService = {
  getAll: async (params?: Record<string, any>) => {
    console.log('🔍 Frontend params:', params);
    try {
      // Backend ListUsersDto strukturasiga mos keladigan parametrlar
      const backendParams: any = {};
      
      // Pagination - backend offset/limit ishlatadi
      if (params?.page && params?.limit) {
        backendParams.offset = (params.page - 1) * params.limit;
        backendParams.limit = params.limit;
      }
      
      // Search - backend 'q' parametrini ishlatadi
      if (params?.search) backendParams.q = params.search;
      
      // Role filter
      if (params?.role) backendParams.role = params.role;
      
      // Status filter - backendda isActive boolean
      if (params?.status === 'active') {
        backendParams.isActive = true;
      } else if (params?.status === 'inactive') {
        backendParams.isActive = false;
      }
      // 'banned' statusi backendda yo'q

      console.log('📤 Backend params:', backendParams);
      
      // Backendga so'rov
      const response = await api.get('/users', { params: backendParams });
      console.log('✅ API Response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params
      });
      
      // Agar 400 xatolik bo'lsa, backend parametrlarni qabul qilmayapti
      if (error.response?.status === 400) {
        console.log('⚠️ Backend parametrlarni qabul qilmayapti. Simple so\'rov qilamiz...');
        // Oddiy so'rov qilish
        try {
          const simpleResponse = await api.get('/users', { 
            params: { offset: 0, limit: 10 } 
          });
          return simpleResponse.data;
        } catch (simpleError) {
          throw simpleError;
        }
      }
      
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserDto) => {
    console.log('📝 Create user data:', userData);
    // Backendga mos format
    const backendData = {
      email: userData.email,
      firstName: userData.firstName, // Backend firstname ga o'tadi
      lastName: userData.lastName,   // Backend lastname ga o'tadi  
      role: userData.role,
      temporaryPassword: userData.temporaryPassword
    };
    const response = await api.post('/users', backendData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserDto) => {
    console.log('✏️ Update user data:', { id, userData });
    // Backendga mos format
    const backendData: any = {};
    if (userData.email) backendData.email = userData.email;
    if (userData.firstName) backendData.firstName = userData.firstName;
    if (userData.lastName) backendData.lastName = userData.lastName;
    if (userData.role) backendData.role = userData.role;
    if (userData.status) {
      backendData.isActive = userData.status === 'active';
    }
    
    const response = await api.patch(`/users/${id}`, backendData);
    return response.data;
  },

  updateRole: async (id: string, roleData: { role: string }) => {
    const response = await api.patch(`/users/${id}/role`, roleData);
    return response.data;
  },

  updateStatus: async (id: string, statusData: { status: string }) => {
    // Backendda status isActive property
    const backendData = { 
      isActive: statusData.status === 'active' 
    };
    const response = await api.patch(`/users/${id}/status`, backendData);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};