import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Menu, Settings } from "@mui/icons-material";
import { Link, Outlet, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useForm } from "../hooks/useForm";
import Header from "../components/Header";
import DrawerLayout from "../components/DrawerLayout";

const EditForm = () => {
  const user = useUser();
  const { form, setForm, loading } = useForm();
  const { pathname } = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const debouncedSave = useMemo(() => {
    return debounce(async (form) => {
      await saveForm(form);
      alert("Encuesta guardada");
    }, 3000);
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newForm = { ...form, [field]: value };

    debouncedSave(newForm);
    setForm(newForm);
  };

  if (loading) {
    return <Typography variant="h2">Loading...</Typography>;
  }

  if (!form) {
    return <Typography variant="h2">No se encontró la encuesta</Typography>;
  }

  if (form.userId !== user.id) {
    return <Typography variant="h2">No autorizado</Typography>;
  }

  return (
    <Box>
      <Header
        leftIcon={
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
          >
            <Menu />
          </IconButton>
        }
      />
      <DrawerLayout open={openDrawer}>
        <Stack spacing={2}>
          <TextField
            variant="filled"
            multiline
            label="Título"
            value={form.title}
            onChange={handleChange("title")}
          />
          <TextField
            variant="filled"
            multiline
            label="Descripción"
            value={form.description}
            onChange={handleChange("description")}
          />
        </Stack>
        {/* <IconButton size="large">
          <Settings />
        </IconButton>
        <Button
          component={Link}
          variant="contained"
          to={`/forms/answer/${form.id}`}
        >
          Enviar
        </Button> */}

        <AppBar position="static">
          <Tabs
            value={pathname}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab
              label="Preguntas"
              value={`/forms/edit/${form.id}`}
              to={`/forms/edit/${form.id}`}
              component={Link}
            />
            <Tab
              label="Respuestas"
              value={`/forms/responses/${form.id}`}
              to={`/forms/responses/${form.id}`}
              component={Link}
            />
          </Tabs>
        </AppBar>

        <Outlet />
      </DrawerLayout>
    </Box>
  );
};

export default EditForm;
