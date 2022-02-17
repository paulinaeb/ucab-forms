import { Select as MuiSelect } from "@mui/material";

const Select = (props) => {
  const renderValue = (value) => value || "Selecciona una opción";

  return <MuiSelect renderValue={renderValue} {...props} />;
};

export default Select;
