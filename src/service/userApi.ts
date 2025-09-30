// service/userApi.ts
import { api } from "./api";

export const userService = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateRole: async (id: string, roleData: any) => {
    const response = await api.patch(`/users/${id}/role`, roleData);
    return response.data;
  },
  updateStatus: async (id: string, statusData: any) => {
    const response = await api.patch(`/users/${id}/status`, statusData);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
