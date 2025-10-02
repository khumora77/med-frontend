import { AccountBox, Home } from "@mui/icons-material";
import {  FaUsers } from "react-icons/fa6";

export const sidebar=[
    {name:"Dashboard", route:"/dashboard", icon:Home},
    {name:"Change-password", route:"/changePasswordAdmin", icon:AccountBox},
    {name:"Users", route:"/users", icon:FaUsers},
    {name:"Patients", route:"/patients", icon:FaUsers},
]

export const receptionSidebar=[
    {name:"Home", route:"/reception", icon:Home},
    {name:"Change-password", route:"/changePasswordReception", icon:AccountBox},
    {name:"Patients", route:"/patients", icon:FaUsers},
]