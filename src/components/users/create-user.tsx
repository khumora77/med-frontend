import React, { useState } from "react";
import { api } from "../../service/api";
import { Button, Card, CardActions, CardContent, CardHeader, MenuItem, TextField, Typography } from "@mui/material";

type Role = "admin" | "doctor" | "reception";

function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [temporaryPassword, setTempPass] = useState("");

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    setMsg(null)
    setErr(null)
    setLoading(true);

    try{
        const {data} = await api.post("/users", {
            email,
            firstName,
            lastName,
            role,
            temporaryPassword,
        })
        setMsg(`Foydalanuvchi yaratildi: ${data.email}`);
      setEmail("");
      setFirst("");
      setLast("");
      setRole("doctor");
      setTempPass("");
    }catch (e: any) {
      setErr(e?.response?.data?.message || "Yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  }

  return <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "200px",
        width: "100%",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardHeader title="New User" />
        <CardContent>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Typography variant="h6">Create new user</Typography>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="FirstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="LastName"
              type="text"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              required
              fullWidth
            />

            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              fullWidth
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              label="Temporary password"
              type="password"
              value={temporaryPassword}
              onChange={(e) => setTempPass(e.target.value)}
              required
              fullWidth
            />

            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? "Created..." : "Create"}
              </Button>
            </CardActions>

            {msg && <Typography color="success.main">{msg}</Typography>}
            {err && <Typography color="error.main">{err}</Typography>}
          </form>
        </CardContent>
      </Card>
    </div>;
}

export default CreateUserForm;
