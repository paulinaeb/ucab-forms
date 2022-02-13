import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Fade,
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
import {
  DatePicker,
  DateTimePicker,
  LoadingButton,
  TimePicker,
} from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  addCollaborator,
  deleteCollaborator,
  deleteForm,
  duplicateForm,
  saveForm,
} from "../../api/forms";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { useAlert } from "../../hooks/useAlert";

const SettingsDialogBody = ({ closeDialog, discardDialog }) => {
  const { form } = useForm();
  const [settings, setSettings] = useState(form.settings);
  const [limitResponses, setLimitResponses] = useState(
    !!form.settings.maxResponses
  );
  const [startDate, setStartDate] = useState(!!form.settings.startDate);
  const [endDate, setEndDate] = useState(!!form.settings.endDate);
  const [collaborator, setCollaborator] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
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
      const formData = { ...form, settings };

      if (!limitResponses) {
        formData.settings.maxResponses = null;
      }

      if (!startDate) {
        formData.settings.startDate = null;
      }

      if (!endDate) {
        formData.settings.endDate = null;
      }

      setSaving(true);
      const { error } = await saveForm(formData);

      if (error) {
        setSaving(false);
        return enqueueSnackbar("No se pudo guardar la encuesta", {
          variant: "error",
        });
      }

      closeDialog();
    };

    const handleDuplicateForm = async () => {
      setDuplicating(true);
      const { error, newForm } = await duplicateForm(form, user);

      if (error) {
        setDuplicating(false);
        return enqueueSnackbar("Error al duplicar la encuesta", {
          variant: "error",
        });
      }

      enqueueSnackbar("Encuesta duplicada", { variant: "success" });
      navigate(`/dashboard`);
      navigate(`/forms/edit/${newForm.id}`);
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
            <ListItem>
              <ListItemText primary="Restringir máximo de aplicaciones" />
              <Switch
                edge="end"
                checked={limitResponses}
                onChange={(e) => setLimitResponses(e.target.checked)}
              />
            </ListItem>
            {limitResponses && (
              <ListItem>
                <ListItemText primary="Máximo de aplicaciones" />
                <TextField
                  variant="standard"
                  type="number"
                  value={settings.maxResponses}
                  onChange={handleChangeValue("maxResponses")}
                  inputProps={{ style: { textAlign: "right" } }}
                />
              </ListItem>
            )}
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
              <ListItemText primary="Aplicar encuesta desde una fecha" />
              <Switch
                edge="end"
                checked={startDate}
                onChange={(e) => setStartDate(e.target.checked)}
              />
            </ListItem>
            {startDate && (
              <ListItem>
                <ListItemText primary="Aplicar desde el" />
                <DateTimePicker
                  value={settings.startDate || null}
                  onChange={handleChange("startDate")}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                  okText="Aceptar"
                  cancelText="Cancelar"
                  toolbarTitle="Seleccionar fecha y hora"
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText primary="Aplicar encuesta hasta una fecha" />
              <Switch
                edge="end"
                checked={endDate}
                onChange={(e) => setEndDate(e.target.checked)}
              />
            </ListItem>
            {endDate && (
              <ListItem>
                <ListItemText primary="Aplicar hasta el" />
                <DateTimePicker
                  value={settings.endDate || null}
                  onChange={handleChange("endDate")}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                  okText="Aceptar"
                  cancelText="Cancelar"
                  toolbarTitle="Seleccionar fecha y hora"
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText primary="Mostrar preguntas en orden aleatorio" />
              <Switch
                edge="end"
                checked={settings.randomOrder}
                onChange={handleChangeChecked("randomOrder")}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Hacer una copia" />
              <LoadingButton
                loading={duplicating}
                variant="outlined"
                onClick={handleDuplicateForm}
              >
                Duplicar
              </LoadingButton>
            </ListItem>
            <ListSubheader sx={{ background: "inherit" }}>
              Zona de peligro
            </ListSubheader>
            <ListItem>
              {/* <ListItemText primary="Eliminar respuestas" /> */}
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteForm} // TODO
                sx={{ width: "100%" }}
              >
                Eliminar respuestas
              </Button>
            </ListItem>
            <ListItem>
              {/* <ListItemText primary="Eliminar encuesta" /> */}
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteForm}
                sx={{ width: "100%" }}
              >
                Eliminar encuesta
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={discardDialog}>
            Descartar
          </Button>
          <Button disabled={saving} onClick={handleSaveForm}>
            Guardar
          </Button>
        </DialogActions>
      </>
    );
  }, [
    adding,
    closeDialog,
    collaborator,
    discardDialog,
    duplicating,
    endDate,
    enqueueSnackbar,
    form,
    limitResponses,
    navigate,
    openAlert,
    saving,
    settings,
    startDate,
    user,
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
