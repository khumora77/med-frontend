import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { userService } from "../service/userApi";
import type { User, UserState } from "../types/userType";

interface UserStore extends UserState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUsers: (params?: any) => Promise<void>;
  deleteUser: (id: string) => Promise<boolean>;
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

        fetchUsers: async (params = {}) => {
  set({ loading: true, error: null });
  try {
    const data = await userService.getAll(params);

    // Agar backend response object bo‘lsa
    const usersArray = Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : [];

    set({
      users: usersArray,
      pagination: {
        current: params.page || 1,
        pageSize: params.limit || 10,
        total: data.total || usersArray.length
      }
    });
  } catch (error: any) {
    set({ error: error.message || "Backend error" });
  } finally {
    set({ loading: false });
  }
}

        deleteUser: async (id) => {
          set({ loading: true, error: null });
          try {
            await userService.remove(id);
            await get().fetchUsers();
            return true;
          } catch (error: any) {
            set({ error: error.message });
            return false;
          } finally {
            set({ loading: false });
          }
        }
      }),
      { name: "user-store" }
    )
  )
);
