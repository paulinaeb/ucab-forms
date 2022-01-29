import { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "../../hooks/useForm";
import { APP_URL } from "../../constants/urls";

const SettingsDialog = ({ open, setOpen }) => {
  const { form } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  return useMemo(() => {
    const handleClose = () => {
      setOpen(false);
    };

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(APP_URL);
        enqueueSnackbar("URL copiada al portapapeles", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("No se pudo copiar la URL", { variant: "error" });
      }
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Enviar Encuesta</DialogTitle>
        <DialogContent>
          <TextField
            variant="standard"
            fullWidth
            defaultValue={`${APP_URL}/forms/answer/${form.id}`}
            onFocus={(e) => e.target.select()}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleCopy}>Copiar</Button>
        </DialogActions>
      </Dialog>
    );
  }, [enqueueSnackbar, form.id, open, setOpen]);
};

export default SettingsDialog;
