import { Route, Routes } from "react-router-dom";
import { RoleRoute } from "./routes/role-route";
import Login from "./pages/login";
import Admin from "./pages/admin";
import Doctor from "./pages/doctor";
import Reception from "./pages/reception";
import { AuthRefresh } from "./bootstrap/auth-refresh";

import ChangePasswordForm from "./pages/change-password";
import Sidebar from "./components/navigation/sidebar";
import { UsersList } from "./components/users/user-list";
import { CreateUserForm } from "./components/users/create-user";

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
            <Route path="/users" element={<UsersList />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />
          </Route>
          <Route path="/create-user" element={<CreateUserForm/>}/>
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
