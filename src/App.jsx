import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { UserProvider } from "./hooks/useUser";
import AuthPage from "./components/AuthPage";
import UnAuthPage from "./components/UnAuthPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditForm from "./pages/EditForm";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          element={
            <UnAuthPage>
              <Typography variant="h1">UCAB Forms</Typography>
              <Outlet />
            </UnAuthPage>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <AuthPage>
              <Dashboard />
            </AuthPage>
          }
        />
        <Route
          path="/forms/:id"
          element={
            <AuthPage>
              <EditForm />
            </AuthPage>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;
