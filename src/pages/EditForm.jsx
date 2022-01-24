import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Menu, Settings } from "@mui/icons-material";
import { Link, Outlet, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useForm } from "../hooks/useForm";
import Header from "../components/Header";
import DrawerLayout from "../components/DrawerLayout";
import Questions from "../components/Questions";
import Responses from "../components/Responses";

const EditForm = () => {
  const user = useUser();
  const { form, setForm, loading } = useForm();
  const [currentTab, setCurrentTab] = useState("0");
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleChangeTab = (event, value) => {
    setCurrentTab(value);
  };

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
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">No se encontró la encuesta</Typography>
        </Box>
      </Box>
    );
  }

  if (form.userId !== user.id) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            No tienes permisos para editar esta encuesta
          </Typography>
        </Box>
      </Box>
    );
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
            sx={{ display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
        }
      />
      <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
        <Stack spacing={2}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                variant="standard"
                multiline
                label="Título"
                value={form.title}
                onChange={handleChange("title")}
              />
              <TextField
                variant="standard"
                multiline
                label="Descripción"
                value={form.description}
                onChange={handleChange("description")}
              />
            </Stack>
          </Card>
          <TabContext value={currentTab}>
            <AppBar position="static">
              <TabList
                onChange={handleChangeTab}
                textColor="inherit"
                indicatorColor="secondary"
                variant="fullWidth"
                aria-label="questions/responses tabs"
              >
                <Tab label="Preguntas" value={"0"} />
                <Tab label="Respuestas" value={"1"} />
              </TabList>
            </AppBar>
            <TabPanel sx={{ p: 0, pt: 1 }} value={"0"}>
              <Questions setOpenDrawer={setOpenDrawer} />
            </TabPanel>
            <TabPanel sx={{ p: 0, pt: 1 }} value={"1"}>
              <Responses />
            </TabPanel>
          </TabContext>
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
      </DrawerLayout>
    </Box>
  );
};

export default EditForm;
