import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { rolePath } from "../routes/role-path";

const ChangePassword = () => {
  const { changePassword, changing, changeError, user } = useAuth();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk("");
    try {
      await changePassword(currentPassword, newPassword);
      setOk("Password changed successfully");
      if (user?.role) {
        navigate(rolePath[user.role as keyof typeof rolePath], {
          replace: true,
        });
      } else {
        navigate("/login", { replace: true });
      }
      setCurrent("");
      setNext("");
    } catch {}
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "150px",
        padding: "16px",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Change Password
            </Typography>
          }
        />
        <CardContent>
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              label="Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNext(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={changing}
              fullWidth
              sx={{
                py: 1.2,
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                },
              }}
            >
              {changing ? "Changed..." : "Changing the password"}
            </Button>

            {changeError && (
              <Typography
                variant="body2"
                sx={{ color: "error.main", textAlign: "center", mt: 1 }}
              >
                {changeError}
              </Typography>
            )}
            {ok && (
              <Typography
                variant="body2"
                sx={{ color: "success.main", textAlign: "center", mt: 1 }}
              >
                {ok}
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
