import {create} from "zustand"
export type Role = "admin" | "doctor" | "reception";
export type User = {
    id: string;
    email: string
    role: Role
    mustChangePassword: boolean
}

type AuthState ={
    token: string | null;
    user: User | null;
    booted: boolean
    login: (t: string, u: User)=> void
    logout:()=> void
    setBooted: (v: boolean)=> void
}

export const useAuth = create<AuthState>((set)=>({
    token: null,
    user: null,
    booted:false,
    login:(token, user)=> set({token, user}),
    logout:()=> set({token:null, user: null}),
    setBooted:(v)=> set({booted:v })
}))