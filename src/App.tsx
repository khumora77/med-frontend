import { Route, Routes } from "react-router-dom";
import { RoleRoute } from "./routes/role-route";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Doctor from "./pages/doctor";
import Reception from "./pages/reception";
import { AuthRefresh } from "./bootstrap/auth-refresh";

import ChangePasswordForm from "./pages/change-password";
import Sidebar from "./components/navigation/adminSidebar";
import { UsersList } from "./components/users/user-list";
import { Dashboard } from "./components/dashboard/dashboard";
import ReceptionSidebar from "./components/navigation/receptionSidebar";
import CreatePatientForm from "./components/patients/create-patient";
import { PatientsList } from "./components/patients/patientList";
import DoctorSidebar from "./components/navigation/doctorSidebar";
import { PatientDetail } from "./components/patients/patiendDetail";
import { AppointmentsList } from "./components/appointments/appointmentList";
import DoctorDashboard from "./components/dashboard/doctorDashboard";
import { PatientAppointmentsPage } from "./components/appointments/appointmentPatientDet";
import { MedicalRecordsList } from "./components/medicalRecords/medicalRecordsList";



function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <RoleRoute roles={["doctor"]}>
                <Doctor />
              </RoleRoute>
            }
          />
          <Route
            path="/reception"
            element={
              <RoleRoute roles={["reception"]}>
                <Reception />
              </RoleRoute>
            }
          />
          <Route element={<Sidebar />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route
              path="/changePasswordAdmin"
              element={<ChangePasswordForm />}
            />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/appointments" element={<AppointmentsList />} />
          </Route>
          <Route element={<ReceptionSidebar />}>
            <Route path="/patientsReception" element={<PatientsList />} />
            <Route
              path="/changePasswordReception"
              element={<ChangePasswordForm />}
            />
                <Route path="/appointmentsReception" element={<AppointmentsList />} />
          </Route>
          <Route element={<DoctorSidebar />}>
            <Route path="/patientsDoctor" element={<PatientsList />} />
            <Route
              path="/changePasswordDoctor"
              element={<ChangePasswordForm />}
            />
            
            <Route path="/doctorDashboard" element={<DoctorDashboard/>}/>
          </Route>
          <Route path="/create-patient" element={<CreatePatientForm />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/change-password" element={<ChangePasswordForm/>}/>
          <Route path="/patients/:id/appointments" element={<PatientAppointmentsPage/>}/>
          <Route path="/patients/:id/records" element={<MedicalRecordsList/>}/>
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
