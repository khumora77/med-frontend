import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import { rolePath } from "../routes/role-path";

const Login = () => {
  // Email va parol uchun state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Yuklanish holati
  const [loading, setLoading] = useState(false);

  // Alert uchun holat
  const [alert, setAlert] = useState<{
    message: string;
    severity: "success" | "error" | "warning" | "info" | "";
  }>({ message: "", severity: "" });

  const navigate = useNavigate();
  const { login } = useAuth();

  // Forma submit funksiyasi
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", severity: "" });

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Token va user ma'lumotlarini store ga saqlash
      login(data.access_token, data.user);

      // Agar foydalanuvchi parolni o‘zgartirishi kerak bo‘lsa
      if (data.user.mustChangePassword) {
        setAlert({
          message: "Parolingizni o‘zgartirishingiz kerak!",
          severity: "warning",
        });
        navigate("/change-password", { replace: true });
        return;
      }

      // Muvaffaqiyatli login
      setAlert({
        message: `Xush kelibsiz, ${data.user.name || data.user.email}!`,
        severity: "success",
      });

      // Rolga qarab yo‘naltirish
      navigate(rolePath[data.user.role as keyof typeof rolePath], {
        replace: true,
      });
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message ||
          "Login bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "white",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
          >
            MedTech
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            Sign In
          </Typography>

          {/* Alert ko‘rsatish */}
          {alert.message && (
            <Alert severity={alert.severity || "info"} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <CircularProgress size={26} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
