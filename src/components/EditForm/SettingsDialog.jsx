import { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";

const SettingsDialog = ({ open, setOpen }) => {
  const { form } = useForm();

  return useMemo(() => {
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Configuraciones</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            vulputate, nisl eget tincidunt ultrices, nisi erat aliquet erat,
            euismod tincidunt nisl nunc eget lorem.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }, [open, setOpen]);
};

export default SettingsDialog;
