import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "../api/auth";
import { useUser } from "../hooks/useUser";
import { createForm, getUserForms } from "../api/forms";

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

    navigate("/forms/" + form.id);
  };

  return (
    <Box>
      <Typography variant="h2">Dashboard</Typography>
      <Typography variant="h3">{user.name}</Typography>
      <Button onClick={createNewForm}>Crear nueva encuesta</Button>
      <Button onClick={signOut}>Sign Out</Button>
      {forms.map((form) => (
        <Box component={Link} to={`/forms/${form.id}`} key={form.id}>
          <Typography variant="h4">{form.title}</Typography>
          <Typography variant="h5">{form.description}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Dashboard;
