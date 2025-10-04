// store/user-store.ts - BACKEND GA MOS
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { userService } from "../service/userApi";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: { current: number; pageSize: number; total: number };
  filters: { page: number; limit: number; search?: string; role?: string };
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<{ page: number; limit: number; search?: string; role?: string }>) => void;
  fetchUsers: (params?: any) => Promise<void>;
  createUser: (userData: any) => Promise<boolean>;
  updateUser: (id: string, userData: any) => Promise<boolean>;
  updateUserRole: (id: string, roleData: { role: string }) => Promise<boolean>; // Object qabul qiladi
  updateUserStatus: (id: string, statusData: { status: string }) => Promise<boolean>; // Object qabul qiladi
  deleteUser: (id: string) => Promise<boolean>;
  clearError: () => void;
  resetFilters: () => void;
}

const initialState = {
  users: [],
  loading: false,
  error: null,
  pagination: { current: 1, pageSize: 10, total: 0 },
  filters: { page: 1, limit: 10 },
};

// Statusni map qilish uchun helper function
const mapStatus = (isActive: boolean, status?: string): 'active' | 'inactive' => {
  if (status) {
    return status === 'active' ? 'active' : 'inactive';
  }
  return isActive ? 'active' : 'inactive';
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        setFilters: (filters) =>
          set({
            filters: { ...get().filters, ...filters },
          }),

        resetFilters: () => set({ filters: initialState.filters }),

        fetchUsers: async (params = {}) => {
          set({ loading: true, error: null });
          try {
            const currentFilters = get().filters;

            const requestParams: any = {
              page: params.page || currentFilters.page || 1,
              limit: params.limit || currentFilters.limit || 10,
            };

            if (params.search && params.search.trim() !== "") {
              requestParams.search = params.search.trim();
            }
            if (params.role) {
              requestParams.role = params.role;
            }

            console.log("🔄 Fetching users with params:", requestParams);
            const data = await userService.getAll(requestParams);

            let usersArray: User[] = [];
            let totalCount = 0;

            if (data) {
              if (data.items && Array.isArray(data.items)) {
                usersArray = data.items.map((item: any) => ({
                  id: item.id || item._id,
                  email: item.email,
                  firstName: item.firstName || item.firstname || "",
                  lastName: item.lastName || item.lastname || "",
                  role: item.role || "user",
                  status: mapStatus(item.isActive, item.status),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                }));
                totalCount = data.total || data.pagination?.total || 0;
              } else if (Array.isArray(data)) {
                usersArray = data.map((item: any) => ({
                  id: item.id || item._id,
                  email: item.email,
                  firstName: item.firstName || item.firstname || "",
                  lastName: item.lastName || item.lastname || "",
                  role: item.role || "user",
                  status: mapStatus(item.isActive, item.status),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                }));
                totalCount = data.length;
              }
            }

            set({
              users: usersArray,
              pagination: {
                current: requestParams.page || 1,
                pageSize: requestParams.limit || 10,
                total: totalCount,
              },
              loading: false,
            });
          } catch (error: any) {
            console.error("❌ Fetch users error:", error);
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Foydalanuvchilarni yuklashda xatolik";
            set({
              error: errorMessage,
              loading: false,
              users: [],
            });
          }
        },

        createUser: async (userData: any) => {
          set({ loading: true, error: null });
          try {
            await userService.create(userData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Foydalanuvchi yaratishda xatolik";
            set({ error: errorMessage, loading: false });
            return false;
          }
        },

        updateUser: async (id: string, userData: any) => {
          set({ loading: true, error: null });
          try {
            await userService.update(id, userData);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Foydalanuvchi yangilashda xatolik";
            set({ error: errorMessage, loading: false });
            return false;
          }
        },

        updateUserRole: async (id: string, roleData: { role: string }) => {
          set({ loading: true, error: null });
          try {
            console.log('🎭 Store: Updating role:', { id, roleData });
            await userService.updateRole(id, roleData);
            
            // Immediate UI update
            const updatedUsers = get().users.map(user => 
              user.id === id ? { ...user, role: roleData.role } : user
            );
            set({ users: updatedUsers, loading: false });
            
            return true;
          } catch (error: any) {
            console.error('❌ UPDATE Role error:', error);
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Role yangilashda xatolik";
            set({ error: errorMessage, loading: false });
            return false;
          }
        },

        updateUserStatus: async (id: string, statusData: { status: string }) => {
          set({ loading: true, error: null });
          try {
            console.log('🔄 Store: Updating status:', { id, statusData });
            await userService.updateStatus(id, statusData);
            
            // Immediate UI update
            const updatedUsers = get().users.map(user => 
              user.id === id ? { ...user, status: statusData.status } : user
            );
            set({ users: updatedUsers, loading: false });
            
            return true;
          } catch (error: any) {
            console.error('❌ UPDATE Status error:', error);
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Status yangilashda xatolik";
            set({ error: errorMessage, loading: false });
            return false;
          }
        },

        deleteUser: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await userService.remove(id);
            await get().fetchUsers(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Foydalanuvchi o'chirishda xatolik";
            set({ error: errorMessage, loading: false });
            return false;
          }
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    )
  )
);