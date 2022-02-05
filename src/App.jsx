import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserProvider } from "./hooks/useUser";
import { FormProvider } from "./hooks/useForm";
import AuthPage from "./components/AuthPage";
import UnAuthPage from "./components/UnAuthPage";
import AuthLayout from "./components/AuthLayout";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditForm from "./pages/EditForm";
import AnswerForm from "./pages/AnswerForm";
import Sent from "./pages/Sent";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          element={
            <UnAuthPage>
              <AuthLayout />
            </UnAuthPage>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route
          element={
            <AuthPage>
              <Outlet />
            </AuthPage>
          }
        >
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/forms/edit/:id"
            element={
              <FormProvider>
                <EditForm />
              </FormProvider>
            }
          />
        </Route>
        <Route
          path="/forms/answer/:id"
          element={
            <ThemeProvider
              theme={(theme) =>
                createTheme({
                  ...theme,
                  // typography: {
                  //   fontFamily: "Helvetica",
                  // },
                  // palette: {
                  //   ...theme.palette,
                  //   primary: {
                  //     main: "#f1e458",
                  //   },
                  // },
                })
              }
            >
              <AnswerForm />
            </ThemeProvider>
          }
        />
        <Route path="/forms/answer/:id/sent" element={<Sent />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
