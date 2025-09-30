// src/store/dashboard-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userService } from "../service/userApi";
import type { User } from "../types/userType";

interface DashboardStats {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  usersByStatus: { status: string; count: number }[];
  recentUsers: User[];
  monthlyGrowth: { month: string; users: number }[];
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
      set({ loading: true, error: null });
      try {
        // Mavjud /users endpointidan foydalanamiz
        const data = await userService.getAll({ limit: 1000 }); // Barcha userlarni olamiz
        
        // Ma'lumotlarni qayta ishlaymiz
        const users = data.items || data || [];
        
        // Statistikani hisoblaymiz
        const stats = calculateUserStats(users);
        set({ stats, loading: false });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Statistika yuklashda xatolik";
        set({ error: errorMessage, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  }))
);

// Statistikani hisoblash funksiyasi
const calculateUserStats = (users: any[]): DashboardStats => {
  // Role bo'yicha
  const roleCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  
  users.forEach(user => {
    // Role hisobi
    const role = user.role || 'user';
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    
    // Status hisobi
    const status = user.isActive ? 'active' : 'inactive';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Oylik o'sish hisobi
  const monthlyGrowth = calculateMonthlyGrowth(users);

  // So'ngi 5 foydalanuvchi
  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstname || user.firstName,
      lastName: user.lastname || user.lastName,
      role: user.role,
      status: user.isActive ? 'active' : 'inactive',
      createdAt: user.createdAt,
    }));

  return {
    totalUsers: users.length,
    usersByRole: Object.entries(roleCounts).map(([role, count]) => ({ role, count })),
    usersByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    recentUsers,
    monthlyGrowth,
  };
};

// Oylik o'sishni hisoblash
const calculateMonthlyGrowth = (users: any[]) => {
  const monthlyCounts: Record<string, number> = {};
  
  users.forEach(user => {
    const date = new Date(user.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
  });

  // So'ngi 6 oy
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = date.toLocaleDateString('uz-UZ', { month: 'short' });
    
    months.push({
      month: monthName,
      users: monthlyCounts[monthKey] || 0,
    });
  }

  return months;
};