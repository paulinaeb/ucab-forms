import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Link = (props) => {
  return <MuiLink component={RouterLink} {...props} />;
};

export default Link;
