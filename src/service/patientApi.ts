// service/patientApi.ts - BACKEND DTO LARGA MOS
import { api } from "./api";
import type { CreatePatientDto, UpdatePatientDto } from "../types/patientsType";

export const patientService = {
  getAll: async (params?: Record<string, any>) => {
    try {
      // Backend ListPatientsDto ga mos parametrlar
      const backendParams: any = {};
      
      // Pagination - backend offset/limit ishlatadi
      if (params?.page && params?.limit) {
        backendParams.offset = (params.page - 1) * params.limit;
        backendParams.limit = params.limit;
      }
      
      // Search - backend 'q' parametrini ishlatadi
      if (params?.search) {
        backendParams.q = params.search;
      }
      
      // Gender filter
      if (params?.gender) {
        backendParams.gender = params.gender;
      }
      
      // Sort - agar kerak bo'lsa
      if (params?.sort) {
        backendParams.sort = params.sort;
      }

      const response = await api.get('/patients', { params: backendParams });
      return response.data;
      
    } catch (error: any) {
      console.error('Patient API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  create: async (patientData: CreatePatientDto) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  update: async (id: string, patientData: UpdatePatientDto) => {
    try {
      const response = await api.patch(`/patients/${id}`, patientData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};