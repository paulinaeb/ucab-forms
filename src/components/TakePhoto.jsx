import { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

const TakePhoto = ({ open, setOpen }) => {
  const bandera = null;

  return useMemo(() => {
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Enviar Encuesta</DialogTitle>
        <DialogContent>
          <TextField
            variant="standard"
            fullWidth
            onFocus={(e) => e.target.select()}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }, [open, setOpen]);
};

export default TakePhoto;
