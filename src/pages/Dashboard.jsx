import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../api/auth";
import { createForm, getUserForms } from "../api/forms";
import { useUser } from "../hooks/useUser";

const Dashboard = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    return getUserForms(user.id, (forms) => {
      setForms(forms);
    });
  }, [user.id]);

  const createNewForm = async () => {
    const { form, error } = await createForm(user.id);

    if (error) {
      return enqueueSnackbar(error, { variant: "error" });
    }

    navigate("/forms/edit/" + form.id);
  };

  const handleSignOut = async () => {
    const res = await signOut();

    if (!res.ok) {
      return enqueueSnackbar("Error al cerrar sesión", { variant: "error" });
    }

    enqueueSnackbar("Saliste de tu cuenta", { variant: "success" });
  };

  return (
    <Box>
      <Typography variant="h2">Dashboard</Typography>
      <Typography variant="h3">{user.name}</Typography>
      <Button onClick={createNewForm}>Crear nueva encuesta</Button>
      <Button onClick={handleSignOut}>Sign Out</Button>
      {forms.map((form) => (
        <Box component={Link} to={`/forms/edit/${form.id}`} key={form.id}>
          <Typography variant="h4">{form.title}</Typography>
          <Typography variant="h5">{form.description}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Dashboard;
