// store/user-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { userService } from "../service/userApi";
import type { User, UserState, CreateUserDto, UpdateUserDto } from "../types/userType";

interface UserStore extends UserState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<UserState['filters']>) => void;
  fetchUsers: (params?: any) => Promise<void>;
  createUser: (userData: CreateUserDto) => Promise<boolean>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<boolean>;
  updateUserRole: (id: string, roleData: { role: string }) => Promise<boolean>;
  updateUserStatus: (id: string, statusData: { status: string }) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  clearError: () => void;
  resetFilters: () => void;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: { current: 1, pageSize: 10, total: 0 },
  filters: { page: 1, limit: 10 }
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        setFilters: (filters) => set({ 
          filters: { ...get().filters, ...filters } 
        }),

        resetFilters: () => set({ filters: initialState.filters }),


        // store/user-store.ts - SIMPLIFIED VERSION
fetchUsers: async (params = {}) => {
  set({ loading: true, error: null });
  try {
    const currentFilters = get().filters;
    
    // Oddiy parametrlar
    const requestParams: any = {
      page: params.page || currentFilters.page || 1,
      limit: params.limit || currentFilters.limit || 10,
    };

    // Faqat asosiy filterlar
    if (params.search && params.search.trim() !== '') {
      requestParams.search = params.search.trim();
    }
    if (params.role) {
      requestParams.role = params.role;
    }
    if (params.status === 'active' || params.status === 'inactive') {
      requestParams.status = params.status;
    }

    console.log('🔄 Fetching with simplified params:', requestParams);
    const data = await userService.getAll(requestParams);

    // Ma'lumotlarni qayta ishlash
    let usersArray: User[] = [];
    let totalCount = 0;

    if (data) {
      if (data.items && Array.isArray(data.items)) {
        usersArray = data.items.map((item: any) => ({
          id: item.id,
          email: item.email,
          firstName: item.firstname || item.firstName || '',
          lastName: item.lastname || item.lastName || '',
          role: item.role,
          status: item.isActive ? 'active' : 'inactive',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        totalCount = data.total || 0;
      } else if (Array.isArray(data)) {
        // Agar backend to'g'ridan-to'g'ri array qaytarsa
        usersArray = data.map((item: any) => ({
          id: item.id,
          email: item.email,
          firstName: item.firstname || item.firstName || '',
          lastName: item.lastname || item.lastName || '',
          role: item.role,
          status: item.isActive ? 'active' : 'inactive',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        totalCount = data.length;
      }
    }

    set({
      users: usersArray,
      pagination: {
        current: requestParams.page || 1,
        pageSize: requestParams.limit || 10,
        total: totalCount
      },
      loading: false
    });

  } catch (error: any) {
    console.error('❌ Fetch error:', error);
    const errorMessage = error.response?.data?.message || error.message || "Xatolik yuz berdi";
    set({ 
      error: errorMessage,
      loading: false,
      users: [] // Xatolikda bo'sh ro'yxat
    });
  }
},

        createUser: async (userData: CreateUserDto) => {
          set({ loading: true, error: null });
          try {
            await userService.create(userData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Foydalanuvchi yaratishda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        updateUser: async (id: string, userData: UpdateUserDto) => {
          set({ loading: true, error: null });
          try {
            await userService.update(id, userData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Foydalanuvchi yangilashda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        updateUserRole: async (id: string, roleData: { role: string }) => {
          set({ loading: true, error: null });
          try {
            await userService.updateRole(id, roleData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Role yangilashda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        updateUserStatus: async (id: string, statusData: { status: string }) => {
          set({ loading: true, error: null });
          try {
            await userService.updateStatus(id, statusData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Status yangilashda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        deleteUser: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await userService.remove(id);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Foydalanuvchi o'chirishda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },
      }),
      { 
        name: "user-store",
        partialize: (state) => ({ 
          filters: state.filters 
        })
      }
    )
  )
);