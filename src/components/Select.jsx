import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { ContentCut } from "@mui/icons-material";

const Select = (props) => {
  const renderValue = (value) => value || "Selecciona una opción";

  return <MuiSelect renderValue={renderValue} {...props} />;
};

export default Select;
