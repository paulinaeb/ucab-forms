import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Typography } from "@mui/material";
import { UserProvider } from "./hooks/useUser";
import { FormProvider } from "./hooks/useForm";
import AuthPage from "./components/AuthPage";
import UnAuthPage from "./components/UnAuthPage";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditForm from "./pages/EditForm";
import Questions from "./pages/Questions";
import Responses from "./pages/Responses";
import AnswerForm from "./pages/AnswerForm";

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
            element={
              <FormProvider>
                <EditForm />
              </FormProvider>
            }
          >
            <Route path="/forms/edit/:id" element={<Questions />} />
            <Route path="/forms/responses/:id" element={<Responses />} />
          </Route>
        </Route>
        <Route path="/forms/answer/:id" element={<AnswerForm />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
