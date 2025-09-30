import { AccountBox, Home } from "@mui/icons-material";
import {  FaUsers } from "react-icons/fa6";

export const sidebar=[
    {name:"Dashboard", route:"/dashboard", icon:Home},
    {name:"Change-password", route:"/change-password", icon:AccountBox},
    {name:"Users", route:"/users", icon:FaUsers},
]

export const receptionSidebar=[
    {name:"Dashboard", route:"/dashboard", icon:Home},
    {name:"Change-password", route:"/change-password", icon:AccountBox},
    {name:"Add-Patients", route:"/add-patients", icon:FaUsers},
]