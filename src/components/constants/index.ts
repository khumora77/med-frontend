import { AccountBox, Home } from "@mui/icons-material";
import {  FaUsers } from "react-icons/fa6";
import { message } from "antd";

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
    {name:"Appointments", route:"/appointmentsReception", icon:FaUsers},
    
]

export const doctorSidebar=[
    {name:"Home", route:"/doctorDashboard", icon:Home},
    {name:"Change-password", route:"/changePasswordDoctor", icon:AccountBox},
    {name:"Patients", route:"/patientsDoctor", icon:FaUsers},

]



type DeleteOptions = {
  id: string;
  deleteFn: (id: string) => Promise<boolean>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void; // masalan navigate yoki fetch qayta chaqirish
};

export const handleDelete = async ({
  id,
  deleteFn,
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete",
  onSuccess,
}: DeleteOptions) => {
  try {
    const success = await deleteFn(id);
    if (success) {
      message.success(successMessage);
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    message.error(errorMessage);
  }
};
