import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Switch,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  addCollaborator,
  deleteCollaborator,
  deleteForm,
  saveForm,
} from "../../api/forms";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";

const SettingsDialogBody = ({ closeDialog, discardDialog }) => {
  const { form, setForm } = useForm();
  const [settings, setSettings] = useState(form.settings);
  // const [limitAnswers, setLimitAnswers] = useState(!!form.settings.maxAnswers);
  const [collaborator, setCollaborator] = useState("");
  const [adding, setAdding] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const user = useUser();
  const openAlert = useAlert();

  return useMemo(() => {
    const handleChangeValue = (field) => (e) => {
      const value = e.target.value;
      const newSettings = { ...settings, [field]: value };

      setSettings(newSettings);
    };

    const handleChangeChecked = (field) => (e) => {
      const checked = e.target.checked;
      const newSettings = { ...settings, [field]: checked };

      setSettings(newSettings);
    };

    const handleChange = (field) => (value) => {
      const newSettings = { ...settings, [field]: value };

      setSettings(newSettings);
    };

    const handleChangeCollaborator = (e) => {
      setCollaborator(e.target.value);
    };

    const handleAddCollaborator = async (e) => {
      e.preventDefault();

      if (
        user.email === collaborator ||
        form.collaborators.find((c) => c.email === collaborator)
      ) {
        return enqueueSnackbar("Este usuario ya es colaborador", {
          variant: "error",
        });
      }

      setAdding(true);

      const { error } = await addCollaborator(form, collaborator);

      setAdding(false);

      if (error) {
        return enqueueSnackbar("No hay usuarios con este email", {
          variant: "error",
        });
      }

      enqueueSnackbar("Colaborador agregado", { variant: "success" });
      setCollaborator("");
    };

    const handleDeleteCollaborator = (collaborator) => {
      openAlert({
        title: "Eliminar colaborador",
        message: "¿Estás seguro de eliminar este colaborador?",
        fullWidth: false,
        action: async () => {
          const { error } = await deleteCollaborator(form, collaborator);

          if (error) {
            return enqueueSnackbar("No se pudo eliminar el colaborador", {
              variant: "error",
            });
          }

          enqueueSnackbar("Colaborador eliminado", {
            variant: "success",
          });
        },
      });
    };

    const handleDeleteForm = async () => {
      navigate("/dashboard");
      await deleteForm(form.id);

      enqueueSnackbar("Encuesta eliminada", { variant: "success" });
    };

    const handleSaveForm = async () => {
      const { error } = await saveForm({
        ...form,
        settings,
      });

      if (error) {
        return enqueueSnackbar("No se pudo guardar la encuesta", {
          variant: "error",
        });
      }

      closeDialog();
    };

    return (
      <>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Configuración
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={discardDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ background: "inherit" }}>
          <List sx={{ background: "inherit" }}>
            <ListSubheader sx={{ background: "inherit" }}>
              Colaboradores
            </ListSubheader>
            <ListItem
              component="form"
              onSubmit={handleAddCollaborator}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                variant="standard"
                fullWidth
                type="email"
                placeholder="Email"
                value={collaborator}
                onChange={handleChangeCollaborator}
              />
              <Button disabled={!collaborator || adding} type="submit">
                Agregar
              </Button>
            </ListItem>
            <ListItem
              sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1 }}
            >
              <Tooltip title={form.author.email} arrow>
                <Chip icon={<AccountCircle />} label={form.author.name} />
              </Tooltip>
              {form.collaborators.map((collaborator, i) => (
                <Tooltip key={i} title={collaborator.email} arrow>
                  <Chip
                    label={collaborator.name}
                    onDelete={() => handleDeleteCollaborator(collaborator)}
                  />
                </Tooltip>
              ))}
            </ListItem>
            <ListSubheader sx={{ background: "inherit" }}>
              Encuesta
            </ListSubheader>
            <ListItem>
              <ListItemText primary="Admite respuestas" />
              <Switch
                edge="end"
                checked={settings.allowResponses}
                onChange={handleChangeChecked("allowResponses")}
              />
            </ListItem>
            {/* <ListItem>
              <ListItemText primary="Restringir máximo de respuestas" />
              <Switch
                edge="end"
                checked={limitAnswers}
                onChange={(e) => setLimitAnswers(e.target.checked)}
              />
            </ListItem> */}
            {/* {limitAnswers && (
              <ListItem sx={{ justifyContent: "flex-end" }}>
                
              </ListItem>
            )} */}
            <ListItem>
              <ListItemText primary="Máximo de aplicaciones" />
              <TextField
                variant="standard"
                type="number"
                placeholder="Vacío: sin límite"
                value={settings.maxResponses}
                onChange={handleChangeValue("maxResponses")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Restringir a una respuesta por persona"
                secondary="Esto requiere usuarios registrados"
              />
              <Switch
                edge="end"
                checked={settings.onlyOneResponse}
                onChange={handleChangeChecked("onlyOneResponse")}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Aplicar encuesta a partir de" />
              <DateTimePicker
                value={settings.startDate || null}
                onChange={handleChange("startDate")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Vacío: sin fecha de inicio"
                  />
                )}
                okText="Aceptar"
                cancelText="Cancelar"
                toolbarTitle="Seleccionar fecha y hora"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Aplicar hasta el" />
              <DateTimePicker
                value={settings.startEnd || null}
                onChange={handleChange("endDate")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Vacío: sin fecha de cierre"
                  />
                )}
                okText="Aceptar"
                cancelText="Cancelar"
                toolbarTitle="Seleccionar fecha y hora"
              />
            </ListItem>
            <ListSubheader sx={{ background: "transparent" }}>
              Zona de peligro
            </ListSubheader>
            <ListItem>
              {/* <ListItemText primary="Eliminar respuestas" /> */}
              <Button
                color="error"
                onClick={handleDeleteForm} // TODO
              >
                Eliminar respuestas
              </Button>
            </ListItem>
            <ListItem>
              {/* <ListItemText primary="Eliminar encuesta" /> */}
              <Button color="error" onClick={handleDeleteForm}>
                Eliminar encuesta
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={discardDialog}>Descartar</Button>
          <Button onClick={handleSaveForm}>Guardar</Button>
        </DialogActions>
      </>
    );
  }, [
    adding,
    closeDialog,
    collaborator,
    discardDialog,
    enqueueSnackbar,
    form,
    navigate,
    openAlert,
    settings,
    user.email,
  ]);
};

const SettingsDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const openAlert = useAlert();

  const closeDialog = () => {
    setOpen(false);
  };

  const discardDialog = () => {
    openAlert({
      title: "¿Deseas descartar los cambios?",
      message: "Si descartas los cambios, se perderán",
      fullWidth: false,
      action: closeDialog,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={discardDialog}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted={false}
    >
      <SettingsDialogBody
        discardDialog={discardDialog}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};

export default SettingsDialog;
