// service/api.ts
import axios from "axios";
import { useAuth } from "../store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Token olish uchun funksiya
const getToken = () => {
  try {
    return useAuth.getState().token;
  } catch (error) {
    return null;
  }
};

// Yangi token bilan auth ni yangilash
const updateAuth = (token: string, user: any) => {
  try {
    useAuth.getState().login(token, user);
  } catch (error) {
    console.error("Auth yangilashda xato:", error);
  }
};

// Logout funksiyasi
const performLogout = () => {
  try {
    useAuth.getState().logout();
    // Login sahifasiga yo'naltirish
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error("Logoutda xato:", error);
  }
};

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let waiters: Array<() => void> = [];

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auth bilan bog'liq endpointlar uchun interceptor ishlamasin
    if (originalRequest.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    // 401 xatosi va retry qilinmagan so'rovlar uchun
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Agar allaqachon token yangilanayotgan bo'lsa
      if (refreshing) {
        await new Promise<void>((resolve) => waiters.push(resolve));
        const newToken = getToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      }

      try {
        refreshing = true;
        originalRequest._retry = true;

        // Token yangilash so'rovi - ALOHIDA axios instance orqali
        // Bu interceptor ga tushib qolmasligi kerak
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/refresh`,
          {},
          { 
            withCredentials: true,
            // Interceptor dan o'tkazmaslik uchun maxsus header
            headers: {
              'X-Skip-Interceptor': 'true'
            }
          }
        );

        if (refreshResponse.data?.access_token) {
          // Yangi token va user ma'lumotlari bilan auth ni yangilash
          updateAuth(refreshResponse.data.access_token, refreshResponse.data.user);
          
          // Kutayotgan so'rovlarni davom ettirish
          waiters.forEach((resolve) => resolve());
          waiters = [];
          
          // Original so'rovni yangi token bilan qayta jo'natish
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token yangilash muvaffaqiyatsiz - logout
        console.error('Token yangilash muvaffaqiyatsiz:', refreshError);
        performLogout();
        return Promise.reject(refreshError);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);