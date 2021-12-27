import { Routes, Route, Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import { UserProvider } from "./hooks/useUser";
import AuthPage from "./components/AuthPage";
import UnAuthPage from "./components/UnAuthPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <UserProvider>
      <Routes>
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
      </Routes>
    </UserProvider>
  );
};

export default App;
