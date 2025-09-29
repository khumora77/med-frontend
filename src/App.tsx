import { Route, Routes } from "react-router-dom";
import { RoleRoute } from "./routes/role-route";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Doctor from "./pages/doctor";
import Reception from "./pages/reception";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import CreateUserForm from "./components/users/create-user";
import ChangePasswordForm from "./pages/change-password";
import Sidebar from "./components/navigation/sidebar";

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
            <Route path="/create-user" element={<CreateUserForm />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />
          </Route>
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
