import  { useState, type FormEvent } from 'react'
import {  Box, Button, Container, Paper, TextField, Typography } from "@mui/material"
import { useAuth } from '../store/authStore'
import {useNavigate} from 'react-router-dom'
import { api } from '../service/api'
import { rolePath } from '../routes/role-path'
const Login = () => {
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const {login}= useAuth()
    const nav = useNavigate()

    async function onSubmit(e: FormEvent){
        e.preventDefault()
        const {data}=await api.post("/auth/login", {email,password})
        login(data.access_token, data.user)
        nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });
    }

    
  return (
    <div>
        <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "white",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
            MedTech
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            SignIn
          </Typography>



          <Box component="form" onSubmit={onSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
           
            />
   <Button type="submit" className="w-full">
              Login
            </Button>
          </Box>

          
        </Paper>
      </Box>
    </Container>
    </div>
  )
}

export default Login