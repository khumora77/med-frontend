// store/appointmentStore.ts
import { create } from 'zustand';
import { appointmentService, type ListAppointmentsParams } from '../service/appointmentApi';

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
  
  fetchAppointments: (params?: ListAppointmentsParams) => Promise<void>;
  fetchAppointmentsByDoctorId: (doctorId: string) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<Appointment | null>;
  createAppointment: (data: any) => Promise<boolean>;
  updateAppointment: (id: string, data: any) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: string) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  getAppointmentsByDoctorId: (doctorId: string) => Appointment[];
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
      console.log('🔄 Fetching all appointments with params:', params);
      
      const response = await appointmentService.getAll(params);
      
      console.log('✅ Received appointments:', {
        count: response.data.length,
        data: response.data,
        firstAppointment: response.data[0]
      });
      
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

  // YANGI METHOD: Faqat ma'lum doctorning appointmentlarini olish
  fetchAppointmentsByDoctorId: async (doctorId: string) => {
    set({ loading: true, error: null });
    try {
      console.log('🎯 Fetching appointments for doctor:', doctorId);
      
      const response = await appointmentService.getAll({ doctorId });
      
      console.log('✅ Received doctor appointments:', {
        doctorId,
        count: response.data.length,
        data: response.data
      });
      
      set({
        appointments: response.data,
        pagination: {
          current: 1,
          pageSize: 10,
          total: response.total || 0,
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('💥 Doctor appointments fetch error:', error);
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch doctor appointments',
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

  getAppointmentsByDoctorId: (doctorId: string) => {
    const { appointments } = get();
    
    console.log('🔍 Filtering appointments by doctorId:', {
      doctorId,
      totalAppointments: appointments.length,
      allDoctorIds: appointments.map(a => a.doctorId),
      appointments: appointments
    });
    
    const filteredAppointments = appointments.filter(appointment => {
      console.log('📝 Checking appointment:', {
        appointmentId: appointment.id,
        appointmentDoctorId: appointment.doctorId,
        matches: appointment.doctorId === doctorId
      });
      return appointment.doctorId === doctorId;
    });
    
    console.log('✅ Filtered results:', {
      doctorId,
      filteredCount: filteredAppointments.length,
      filteredAppointments: filteredAppointments
    });
    
    return filteredAppointments;
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