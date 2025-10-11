// src/services/medicalRecordsApi.ts
import { api } from './api';

export const medicalRecordsApi = {
  // Yozuvlarni olish - appointments bilan bir xil strukturda
  list: async (patientId: string, params?: { page?: number; limit?: number; offset?: number }) => {
    const url = `/patients/${patientId}/records`;
    
    // Appointments API bilan bir xil parametrlarni yuboramiz
    const requestParams = {
      limit: params?.limit || 10,
      offset: params?.offset || 0
      // page o'rniga offset ishlatamiz
    };

    console.log('🚀 Medical Records API Request:', {
      url: `${api.defaults.baseURL}${url}`,
      params: requestParams
    });

    try {
      const response = await api.get(url, { params: requestParams });
      console.log('✅ Medical Records API Success:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Medical Records API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message
      });
      throw error;
    }
  },

  // Yangi yozuv yaratish
  create: (patientId: string, data: any) => {
    console.log('📝 Creating medical record:', { patientId, data });
    return api.post(`/patients/${patientId}/records`, data);
  },

  getOne: (id: string) => 
    api.get(`/records/${id}`),

  update: (id: string, data: any) => 
    api.patch(`/records/${id}`, data),

  delete: (id: string) => 
    api.delete(`/records/${id}`),
};