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
import { Close as CloseIcon } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { saveForm } from "../../api/forms";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";

const SettingsDialogBody = ({ closeDialog, discardDialog, setChanges }) => {
  const { form } = useForm();
  const [settings, setSettings] = useState(form.settings);
  const [limitResponses, setLimitResponses] = useState(
    !!form.settings.maxResponses
  );
  const [startDate, setStartDate] = useState(!!form.settings.startDate);
  const [endDate, setEndDate] = useState(!!form.settings.endDate);
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  return useMemo(() => {
    const handleChangeValue = (field) => (e) => {
      setChanges(true);
      const value = e.target.value;
      const newSettings = { ...settings, [field]: value };

      setSettings(newSettings);
    };

    const handleChangeChecked = (field) => (e) => {
      setChanges(true);
      const checked = e.target.checked;
      const newSettings = { ...settings, [field]: checked };

      setSettings(newSettings);
    };

    const handleChange = (field) => (value) => {
      setChanges(true);
      const newSettings = { ...settings, [field]: value };

      setSettings(newSettings);
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
              Encuesta
            </ListSubheader>
            <ListItem>
              <ListItemText primary="Admitir respuestas" />
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
                onChange={(e) => {
                  console.log("Ay");
                  setChanges(true);
                  setLimitResponses(e.target.checked);
                }}
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
                onChange={(e) => {
                  setChanges(true);
                  setStartDate(e.target.checked);
                }}
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
                onChange={(e) => {
                  setChanges(true);
                  setEndDate(e.target.checked);
                }}
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
    closeDialog,
    discardDialog,
    endDate,
    enqueueSnackbar,
    form,
    limitResponses,
    saving,
    setChanges,
    settings,
    startDate,
  ]);
};

const SettingsDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const openAlert = useAlert();
  const [changes, setChanges] = useState(false);

  const closeDialog = () => {
    setChanges(false);
    setOpen(false);
  };

  const discardDialog = () => {
    if (changes) {
      openAlert({
        title: "¿Deseas descartar los cambios?",
        message: "Si descartas los cambios, se perderán",
        fullWidth: false,
        action: closeDialog,
      });
    } else {
      closeDialog();
    }
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
        setChanges={setChanges}
        discardDialog={discardDialog}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};

export default SettingsDialog;
