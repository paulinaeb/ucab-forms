import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
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
        <Stack spacing={1}>
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
          <Box>
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
              <TabPanel value={"0"}>
                <Questions />
              </TabPanel>
              <TabPanel value={"1"}>
                <Responses />
              </TabPanel>
            </TabContext>
          </Box>
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
