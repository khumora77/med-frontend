// store/appointmentStore.ts
import { create } from 'zustand';
import { appointmentService } from '../service/appointmentApi';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  createdBy?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  doctor?: {
    id: string;
    firstname: string;
    lastname: string;
    role: string;
    specialization?: string;
  };
}

interface ListAppointmentsParams {
  page?: number;
  limit?: number;
  patientId?: string;
  doctorId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'startAsc' | 'startDesc' | 'newest' | 'oldest';
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: ListAppointmentsParams;
  
  // Actions
  fetchAppointments: (params?: ListAppointmentsParams) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<Appointment | null>;
  createAppointment: (data: any) => Promise<boolean>;
  updateAppointment: (id: string, data: any) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: string) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  setFilters: (filters: ListAppointmentsParams) => void;
  resetFilters: () => void;
  clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {},

  fetchAppointments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Fetching appointments with params:', params);
      
      const response = await appointmentService.getAll(params);
      
      console.log('✅ Received appointments:', response.data.length, 'items');
      
      set({
        appointments: response.data,
        pagination: {
          current: params.page || 1,
          pageSize: params.limit || 10,
          total: response.total || 0,
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('💥 Store fetch error:', error);
      
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch appointments',
        loading: false,
      });
    }
  },

  fetchAppointmentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await appointmentService.getById(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch appointment',
        loading: false,
      });
      return null;
    }
  },

  createAppointment: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.create(data);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create appointment',
        loading: false,
      });
      return false;
    }
  },

  updateAppointment: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.update(id, data);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update appointment',
        loading: false,
      });
      return false;
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.updateStatus(id, { status });
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update appointment status',
        loading: false,
      });
      return false;
    }
  },

  deleteAppointment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.delete(id);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete appointment',
        loading: false,
      });
      return false;
    }
  },

  setFilters: (filters: ListAppointmentsParams) => {
    set({ filters });
  },

  resetFilters: () => {
    set({ 
      filters: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      }
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));