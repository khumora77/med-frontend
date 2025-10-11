// src/store/medicalRecordStore.ts
import { create } from 'zustand';
import { medicalRecordsApi } from '../service/medicalRecordsApi';

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  treatment?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    firstname: string;
    lastname: string;
  };
}

interface MedicalRecordStore {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  fetchRecords: (params: {
    patientId: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  createRecord: (data: any) => Promise<boolean>;
  deleteRecord: (id: string) => Promise<boolean>;
  updateRecord: (id: string, data: any) => Promise<boolean>;
}

export const useMedicalRecordStore = create<MedicalRecordStore>((set, get) => ({
  records: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },

  fetchRecords: async (params) => {
    set({ loading: true, error: null });
    try {
      // page ni offset ga aylantiramiz
      const page = params.page || 1;
      const limit = params.limit || 10;
      const offset = (page - 1) * limit;

      const response = await medicalRecordsApi.list(params.patientId, {
        limit: limit,
        offset: offset
      });
      
      console.log('📊 Medical Records Full Response:', response.data);
      
      // Backend response strukturasi bo'yicha moslashtirish
      let records = [];
      let total = 0;

      if (response.data && Array.isArray(response.data)) {
        // Agar to'g'ridan-to'g'ri array qaytsa
        records = response.data;
        total = response.data.length;
      } else if (response.data && response.data.data) {
        // Agar { data: [], total: number } formatida qaytsa
        records = response.data.data;
        total = response.data.total || response.data.data.length;
      } else if (response.data && response.data.records) {
        // Agar { records: [], total: number } formatida qaytsa
        records = response.data.records;
        total = response.data.total || response.data.records.length;
      } else if (response.data && response.data.items) {
        // Agar appointments kabi { items: [], total: number } formatida qaytsa
        records = response.data.items;
        total = response.data.total || response.data.items.length;
      } else {
        console.warn('⚠️ Unknown response format, using empty array');
        records = [];
        total = 0;
      }
      
      set({
        records: records,
        loading: false,
        pagination: {
          current: page,
          pageSize: limit,
          total: total,
        },
      });
    } catch (error: any) {
      console.error('❌ Store Error fetching medical records:', error);
      
      // Backenddan kelgan xabarni olish
      const backendError = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message;
      
      set({
        error: backendError || 'Failed to fetch medical records',
        loading: false,
        records: [],
      });
    }
  },

  createRecord: async (data) => {
    try {
      const response = await medicalRecordsApi.create(data.patientId, {
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        notes: data.notes,
        followUpDate: data.followUpDate
      });
      
      // Yangi recordni ro'yxatga qo'shish
      const { records } = get();
      const newRecord = response.data.data || response.data;
      
      set({
        records: [newRecord, ...records],
      });
      
      return true;
    } catch (error: any) {
      console.error('Error creating medical record:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create medical record';
      
      set({
        error: errorMessage,
      });
      return false;
    }
  },

  deleteRecord: async (id: string) => {
    try {
      await medicalRecordsApi.delete(id);
      
      // Recordni ro'yxatdan o'chirish
      const { records } = get();
      set({
        records: records.filter(record => record.id !== id),
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting medical record:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete medical record';
      
      set({
        error: errorMessage,
      });
      return false;
    }
  },

  updateRecord: async (id: string, data: any) => {
    try {
      const response = await medicalRecordsApi.update(id, data);
      
      // Recordni yangilash
      const { records } = get();
      const updatedRecord = response.data.data || response.data;
      
      set({
        records: records.map(record =>
          record.id === id ? updatedRecord : record
        ),
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating medical record:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update medical record';
      
      set({
        error: errorMessage,
      });
      return false;
    }
  },
}));