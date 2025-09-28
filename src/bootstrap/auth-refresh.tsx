import { useEffect } from "react";
import { useAuth } from "../store/authStore";
import { api } from "../service/api";
export function AuthRefresh({ children }: { children: React.ReactNode }) {
  const { token, user, login, logout, booted, setBooted } = useAuth();

  useEffect(() => {
    (async () => {
      if (booted) return;
      try {
        if (!token) {
          const { data } = await api.post("/auth/refresh"); 
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
