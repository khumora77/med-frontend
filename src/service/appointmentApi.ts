// services/appointmentApi.ts
import { api } from "./api";

export interface ListAppointmentsParams {
  page?: number;
  limit?: number;
  patientId?: string;
  doctorId?: string;
  status?: string;
  startDate?: string;  // Backendda 'from'
  endDate?: string;    // Backendda 'to'
  sort?: 'startAsc' | 'startDesc' | 'newest' | 'oldest';
}

export const appointmentService = {
  getAll: async (params?: ListAppointmentsParams) => {
    try {
      // Backend DTO ga to'liq mos parametrlar
      const backendParams: any = {
        offset: 0,
        limit: 10,
      };

      // Pagination
      if (params?.page !== undefined && params?.limit !== undefined) {
        backendParams.offset = (params.page - 1) * params.limit;
        backendParams.limit = params.limit;
      }

      // Patient filter
      if (params?.patientId) {
        backendParams.patientId = params.patientId;
      }

      // Doctor filter
      if (params?.doctorId) {
        backendParams.doctorId = params.doctorId;
      }

      // Status filter
      if (params?.status) {
        backendParams.status = params.status;
      }

      // Date range filter
      if (params?.startDate) {
        backendParams.from = params.startDate;
      }
      if (params?.endDate) {
        backendParams.to = params.endDate;
      }

      // Sort - backend 'startAsc' yoki 'startDesc' qo'llaydi
      if (params?.sort) {
        if (params.sort === 'newest' || params.sort === 'startDesc') {
          backendParams.sort = 'startDesc';
        } else if (params.sort === 'oldest' || params.sort === 'startAsc') {
          backendParams.sort = 'startAsc';
        }
      }

      console.log('📤 Sending appointment request:', backendParams);
      
      const response = await api.get('/appointments', { 
        params: backendParams 
      });
      
      console.log('📥 Appointment API response:', response.data);
      
      return {
        data: response.data.items || [],
        total: response.data.total || 0,
      };
      
    } catch (error: any) {
      console.error('❌ Appointment API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Get appointment by ID ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (appointmentData: any) => {
    try {
      // Frontenddan backend DTO ga o'tkazish
      const backendDto = {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        startAt: appointmentData.startAt,
        endAt: appointmentData.endAt,
        status: appointmentData.status || 'scheduled',
        reason: appointmentData.reason,
      };

      console.log('➕ Creating appointment:', backendDto);
      const response = await api.post('/appointments', backendDto);
      return response.data;
    } catch (error: any) {
      console.error('Create appointment error:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string, appointmentData: any) => {
    try {
      const backendDto: any = {};
      
      if (appointmentData.patientId) backendDto.patientId = appointmentData.patientId;
      if (appointmentData.doctorId) backendDto.doctorId = appointmentData.doctorId;
      if (appointmentData.startAt) backendDto.startAt = appointmentData.startAt;
      if (appointmentData.endAt) backendDto.endAt = appointmentData.endAt;
      if (appointmentData.status) backendDto.status = appointmentData.status;
      if (appointmentData.reason !== undefined) backendDto.reason = appointmentData.reason;

      console.log('✏️ Updating appointment:', backendDto);
      const response = await api.patch(`/appointments/${id}`, backendDto);
      return response.data;
    } catch (error: any) {
      console.error(`Update appointment ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateStatus: async (id: string, statusData: any) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, {
        status: statusData.status
      });
      return response.data;
    } catch (error: any) {
      console.error(`Update appointment status ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Delete appointment ${id} error:`, error.response?.data || error.message);
      throw error;
    }
  }
};