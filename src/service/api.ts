import axios from "axios";
import { useAuth } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://supercultivated-neumic-rose.ngrok-free.dev",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = useAuth.getState().token;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshing = false;
let waiters: Array<() => void> = [];

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        await new Promise<void>((res) => waiters.push(res));
        original.headers.Authorization = `Bearer ${useAuth.getState().token}`;
        original._retry = true;
        return api(original);
      }
      try {
        refreshing = true;
        original._retry = true;
        const { data } = await api.post("/auth/refresh");
        if (data?.access_token) {
          useAuth.getState().login(data.access_token, data.user);
          waiters.forEach((fn) => fn());
          waiters = [];
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        }
      } catch (e) {
        useAuth.getState().logout();
        throw e;
      } finally {
        refreshing = false;
      }
    }
    throw err;
  }
);