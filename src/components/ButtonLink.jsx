import { forwardRef } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ButtonLink = ({ to, ...props }) => {
  return (
    <Button
      component={forwardRef((props, ref) => (
        <Link ref={ref} to={to} role={undefined} />
      ))}
      {...props}
    />
  );
};

export default ButtonLink;
