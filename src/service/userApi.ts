import { api } from "./api";
import type { CreateUserDto, UpdateUserDto } from "../types/userType";

export const userService = {
  getAll: async (params?: Record<string, any>) => {
    console.log("Frontend params:", params);
    try {
      const backendParams: any = {};

      if (params?.page && params?.limit) {
        backendParams.offset = (params.page - 1) * params.limit;
        backendParams.limit = params.limit;
      }

      if (params?.search) backendParams.q = params.search;

      console.log("Backend params:", backendParams);

      const response = await api.get("/users", { params: backendParams });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        params: error.config?.params,
      });
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserDto) => {
    console.log("Create user data:", userData);

    const backendData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      temporaryPassword: userData.temporaryPassword,
    };
    const response = await api.post("/users", backendData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserDto) => {
    console.log("Update user data:", { id, userData });
    const backendData: any = {};
    if (userData.email) backendData.email = userData.email;
    if (userData.firstName) backendData.firstName = userData.firstName;
    if (userData.lastName) backendData.lastName = userData.lastName;
    if (userData.role) backendData.role = userData.role;

    const response = await api.patch(`/users/${id}`, backendData);
    return response.data;
  },

  updateRole: async (id: string, roleData: { role: string }) => {
    console.log("Update role:", { id, roleData });
    const response = await api.patch(`/users/${id}/role`, roleData);
    return response.data;
  },

  updateStatus: async (id: string, statusData: { status: string }) => {
    console.log("Update status:", { id, statusData });
    
    // Backend isActive fieldini kutayapti
    const backendData = {
      isActive: statusData.status === "active",
    };
    
    console.log("Sending to backend:", backendData);
    const response = await api.patch(`/users/${id}/status`, backendData);
    console.log("Status update response:", response.data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};