import { AccountBox, Home } from "@mui/icons-material";
import {  FaUsers } from "react-icons/fa6";

export const sidebar=[
    {name:"Dashboard", route:"/dashboard", icon:Home},
    {name:"Change-password", route:"/changePasswordAdmin", icon:AccountBox},
    {name:"Users", route:"/users", icon:FaUsers},
    {name:"Patients", route:"/patients", icon:FaUsers},
    {name:"Appointments", route:"/appointments", icon:FaUsers},
]

export const receptionSidebar=[
    {name:"Home", route:"/reception", icon:Home},
    {name:"Change-password", route:"/changePasswordReception", icon:AccountBox},
    {name:"Patients", route:"/patientsReception", icon:FaUsers},
]

export const doctorSidebar=[
    {name:"Home", route:"/doctor", icon:Home},
    {name:"Change-password", route:"/changePasswordDoctor", icon:AccountBox},
    {name:"Patients", route:"/patientsDoctor", icon:FaUsers},
        {name:"Appointments", route:"/appointmentsDoctor", icon:FaUsers},
]