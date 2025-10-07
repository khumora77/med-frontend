// store/doctorStore.ts
import { create } from 'zustand';
import { useAuth } from './authStore';


interface Doctor {
  id: string;
  firstname: string;
  lastname: string;
  specialization?: string;
  phone?: string;
  email?: string;
  role: string;
}

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  fetchDoctors: () => Promise<void>;
  getDoctorById: (id: string) => Doctor | undefined;
  clearError: () => void;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  loading: false,
  error: null,

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      // Auth store dan token va user ma'lumotlarini olish
      const { token, user } = useAuth.getState();
      
      console.log('🔐 Auth state:', { 
        hasToken: !!token, 
        hasUser: !!user,
        userRole: user?.role 
      });

      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      console.log('🔄 Fetching all users from API...');
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
      
      // Barcha userlarni olish
      const response = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('📥 All users API response:', responseData);

      // Responseni qayta ishlash
      let users = [];
      
      if (Array.isArray(responseData)) {
        users = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        users = responseData.data;
      } else if (responseData.users && Array.isArray(responseData.users)) {
        users = responseData.users;
      } else if (responseData.items && Array.isArray(responseData.items)) {
        users = responseData.items;
      } else {
        throw new Error('Unexpected response format from users API');
      }

      console.log('👥 Total users found:', users.length);

      // Faqat doctor role ga ega userlarni filter qilish
      const doctors = users
        .filter((user: any) => user.role === 'doctor')
        .map((user: any) => ({
          id: user.id,
          firstname: user.firstname || user.firstName || 'Doctor',
          lastname: user.lastname || user.lastName || 'Unknown',
          specialization: user.specialization || 'General Medicine',
          phone: user.phone || 'Not provided',
          email: user.email || 'Not provided',
          role: user.role
        }));

      console.log('✅ Filtered doctors:', doctors);
      console.log('🎯 Doctors count:', doctors.length);
      
      if (doctors.length === 0) {
        throw new Error('No doctors found in the system. Please add doctors first.');
      }

      set({ 
        doctors, 
        loading: false 
      });
      console.log('🎉 Successfully loaded', doctors.length, 'doctors from API');
      
    } catch (error: any) {
      console.error('💥 Doctor fetch error:', error);
      
      set({ 
        doctors: [], 
        loading: false,
        error: error.message 
      });
    }
  },

  getDoctorById: (id: string) => {
    const { doctors } = get();
    return doctors.find(doctor => doctor.id === id);
  },

  clearError: () => {
    set({ error: null });
  },
}));