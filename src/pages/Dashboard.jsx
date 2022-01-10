import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../api/auth";
import { createForm, getUserForms } from "../api/forms";
import { useUser } from "../hooks/useUser";

const Dashboard = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    return getUserForms(user.id, (forms) => {
      setForms(forms);
    });
  }, [user.id]);

  const createNewForm = async () => {
    const { form, error } = await createForm(user.id);

    if (error) {
      return alert(error.message);
    }

    navigate("/forms/edit/" + form.id);
  };

  return (
    <Box>
      <Typography variant="h2">Dashboard</Typography>
      <Typography variant="h3">{user.name}</Typography>
      <Button onClick={createNewForm}>Crear nueva encuesta</Button>
      <Button onClick={signOut}>Sign Out</Button>
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
