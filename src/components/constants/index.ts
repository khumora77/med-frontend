import { AccountBox, Home, Settings } from "@mui/icons-material";
import { FaUserDoctor, FaUsers, FaUserTie } from "react-icons/fa6";

export const sidebar=[
    {name:"Dashboard", route:"/admin", icon:Home},
    {name:"Change-password", route:"/change-password", icon:AccountBox},
    {name:"Doctors", route:"/doctors", icon:FaUserDoctor},
    {name:"Receptions", route:"/receptions", icon:FaUserTie},
    {name:"Users", route:"/users", icon:FaUsers},
    {name:"Settings", route:"/settings", icon:Settings},
]