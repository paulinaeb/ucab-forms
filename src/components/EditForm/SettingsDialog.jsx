import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Switch,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { deleteForm, saveForm } from "../../api/forms";
import { useForm } from "../../hooks/useForm";

const SettingsDialogBody = ({ closeDialog }) => {
  const { form, setForm } = useForm();
  const [settings, setSettings] = useState(form.settings);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

    const handleDeleteForm = async () => {
      navigate("/");
      await deleteForm(form.id);

      enqueueSnackbar("Encuesta eliminada", { variant: "success" });
    };

    const handleSaveForm = async () => {
      closeDialog();
    };

    return (
      <>
        <DialogTitle>Configuración</DialogTitle>
        <DialogContent>
          <List>
            <ListSubheader sx={{ background: "transparent" }}>
              Encuesta
            </ListSubheader>
            <ListItem>
              <ListItemText primary="Admite respuestas" />
              <Switch
                edge="end"
                checked={settings.allowAnswers}
                onChange={handleChangeChecked("allowAnswers")}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Restringir máximo de respuestas" />
              <Switch
                edge="end"
                checked={settings.maxAnswers}
                onChange={handleChangeChecked("maxAnswers")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Máximo número de respuestas"
                secondary="Limitar el número de respuestas totales a una cantidad"
              />
              <TextField
                variant="standard"
                type="number"
                // placeholder="Vacío: sin límite"
                value={settings.maxResponses ?? ""}
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
                checked={settings.maxAnswers}
                onChange={handleChangeChecked("maxAnswers")}
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
          <Button onClick={closeDialog}>Descartar</Button>
          <Button onClick={handleSaveForm}>Guardar</Button>
        </DialogActions>
      </>
    );
  }, [closeDialog, enqueueSnackbar, form.id, navigate, settings]);
};

const SettingsDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm" // SEEEEE
      keepMounted={false}
    >
      <SettingsDialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default SettingsDialog;
