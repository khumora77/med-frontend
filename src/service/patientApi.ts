// service/patientApi.ts - BACKEND DTO LARGA TO'LIQ MOS
import { api } from "./api";
import type { CreatePatientDto, UpdatePatientDto } from "../types/patientsType";

export interface PatientListParams {
  offset?: number;
  limit?: number;
  q?: string;    // Backend 'q' parametri - search uchun
  gender?: string;
  sort?: 'newest' | 'oldest';
}

export const patientService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
    sort?: 'newest' | 'oldest';
  }) => {
    try {
      // Backend DTO ga to'liq mos parametrlar
      const backendParams: PatientListParams = {
        offset: 0,
        limit: 20,
        sort: 'newest'
      };

      // Pagination - faqat offset/limit
      if (params?.page !== undefined && params?.limit !== undefined) {
        backendParams.offset = (params.page - 1) * params.limit;
        backendParams.limit = params.limit;
      }

      // Search - backend 'q' parametriga o'tkazish
      if (params?.search && params.search.trim() !== '') {
        backendParams.q = params.search.trim();
      }

      // Gender filter
      if (params?.gender) {
        backendParams.gender = params.gender;
      }

      // Sort
      if (params?.sort) {
        backendParams.sort = params.sort;
      }

      console.log('Backend params:', backendParams);
      
      const response = await api.get('/patients', { 
        params: backendParams 
      });
      
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
      console.error(`Get patient by ID ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (patientData: CreatePatientDto) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error: any) {
      console.error('Create patient error:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, patientData: UpdatePatientDto) => {
    try {
      const response = await api.patch(`/patients/${id}`, patientData);
      return response.data;
    } catch (error: any) {
      console.error(`Update patient ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Delete patient ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  }
};