import { api } from "./api";

// service/medicalRecordsApi.ts
export const getRecords = async (patientId: string) => {
  try {
    const { data } = await api.get(`/patients/${patientId}/records`);
    
    // Har xil strukturalar uchun universal yechim
    if (Array.isArray(data)) {
      return data; // Agar to'g'ridan-to'g'ri array bo'lsa
    } else if (Array.isArray(data?.items)) {
      return data.items; // Agar {items: [...]} struktura bo'lsa
    } else if (Array.isArray(data?.data)) {
      return data.data; // Agar {data: [...]} struktura bo'lsa
    } else if (data && typeof data === 'object') {
      // Boshqa strukturalarni tekshirish
      const possibleArrays = Object.values(data).find(Array.isArray);
      return possibleArrays || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting records:", error);
    throw error;
  }
};

// 🔹 Yangi yozuv yaratish
export const createRecord = async (patientId: string, record: any) => {
  const { data } = await api.post(`/patients/${patientId}/records`, record);
  return data;
};



// 🔹 Yozuvni o‘chirish
export const deleteRecord = async (recordId: string) => {
  const { data } = await api.delete(`/records/${recordId}`);
  return data;
};
