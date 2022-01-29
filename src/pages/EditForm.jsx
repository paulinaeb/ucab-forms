import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  LinearProgress,
  Stack,
  Tab,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  AccountCircle,
  Menu as MenuIcon,
  MoreVert,
  Send,
  Settings,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import debounce from "lodash.debounce";
import { saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useForm } from "../hooks/useForm";
import Header from "../components/Header";
import DrawerLayout from "../components/EditForm/DrawerLayout";
import Questions from "../components/EditForm/Questions";
import Responses from "../components/EditForm/Responses";
import SettingsDialog from "../components/EditForm/SettingsDialog";
import SendDialog from "../components/EditForm/SendDialog";

const EditForm = () => {
  const user = useUser();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const { form, setForm, loading } = useForm();
  const [currentTab, setCurrentTab] = useState("0");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openSend, setOpenSend] = useState(false);

  const popupStateMore = usePopupState({
    variant: "popover",
    popupId: "more-menu-aaaa",
  });

  const handleClickOpenSettings = () => {
    popupStateMore.close();
    setOpenSettings(true);
  };

  const handleClickOpenSend = () => {
    popupStateMore.close();
    setOpenSend(true);
  };

  const handleChangeTab = (e, value) => {
    setCurrentTab(value);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const debouncedSave = useMemo(() => {
    return debounce(async (form) => {
      await saveForm(form);
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
        leftIcons={
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        }
        rightIcons={
          upMd && (
            <>
              <Tooltip title="Configuraciones" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleClickOpenSettings}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                sx={{ px: 3, ml: 1, mr: 2 }}
                onClick={handleClickOpenSend}
              >
                Enviar
              </Button>
            </>
          )
        }
        moreMenu={
          !upMd && (
            <>
              <Tooltip title="Más" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  edge="end"
                  {...bindTrigger(popupStateMore)}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu {...bindMenu(popupStateMore)} disableEnforceFocus>
                <MenuItem onClick={handleClickOpenSend}>
                  <ListItemIcon>
                    <Send fontSize="small" />
                  </ListItemIcon>
                  Enviar
                </MenuItem>
                <MenuItem onClick={handleClickOpenSettings}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Configuraciones
                </MenuItem>
              </Menu>
            </>
          )
        }
      />
      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
      <SendDialog open={openSend} setOpen={setOpenSend} />
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
                indicatorColor="primary"
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
      </DrawerLayout>
    </Box>
  );
};

export default EditForm;
