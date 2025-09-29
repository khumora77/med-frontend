import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true);
    try {
      // Bu yerda API chaqiriladi
      await new Promise((res) => setTimeout(res, 1000)); // demo uchun
      setOk("✅ Parol muvaffaqiyatli yangilandi!");
      setChangeError("");
    } catch (err) {
      setChangeError("❌ Parolni almashtirishda xatolik yuz berdi!");
      setOk("");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "200px",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardHeader title="New Password" />
        <CardContent>
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextField
              label="Joriy parol"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Yangi parol"
              type="password"
              value={newPassword}
              onChange={(e) => setNext(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={changing}
              fullWidth
            >
              {changing ? "Yuborilmoqda..." : "Parolni almashtirish"}
            </Button>

            {changeError && (
              <Typography variant="body2" color="error">
                {changeError}
              </Typography>
            )}
            {ok && (
              <Typography variant="body2" color="success.main">
                {ok}
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
