// src/store/auth.ts
import { api } from "../service/api";
import { create } from "zustand";
export type Role = "admin" | "doctor" | "reception";
export type User = {
  id: string;
  email: string;
  role: Role;
  mustChangePassword: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  booted: boolean;
  login: (t: string, u: User) => void;
  logout: () => void;
  setBooted: (v: boolean) => void;
  changing: boolean;
  changeError: string | null;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  booted: false,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
  setBooted: (v) => set({ booted: v }),
  changing: false,
  changeError: null,
  async changePassword(currentPassword, newPassword) {
    set({ changing: true, changeError: null });
    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      const u = get().user;
      if (u) set({ user: { ...u, mustChangePassword: false } });
      console.log(data.message);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data)
          ? err.response.data.join(", ")
          : "") ||
        "Parolni almashtirishda xatolik";
      set({ changeError: msg });
      throw err;
    } finally {
      set({ changing: false });
    }
  },
}));