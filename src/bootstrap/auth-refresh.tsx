// src/bootstrap/AuthGate.tsx
import { api } from "../service/api";
import { useAuth } from "../store/auth.store";
import { useEffect } from "react";
export function AuthRefresh({ children }: { children: React.ReactNode }) {
  const { token, user, login, logout, booted, setBooted } = useAuth();

  useEffect(() => {
    (async () => {
      if (booted) return; // faqat bir marta
      try {
        // Agar token yo‘q bo‘lsa ham, cookie bor — refresh yangi access token beradi
        if (!token) {
          const { data } = await api.post("/auth/refresh"); // withCredentials: true
          if (data?.access_token) login(data.access_token, data.user);
        }
      } catch {
        logout();
      } finally {
        setBooted(true);
      }
    })();
  }, [booted, token]);

  if (!booted) return null;

  return <>{children}</>;
}