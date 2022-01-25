import { Typography } from "@mui/material";

const RequiredMark = ({ question }) => {
  if (!question.required) {
    return null;
  }

  return (
    <Typography component="span" color="error">
      {" "}
      *
    </Typography>
  );
};

export default RequiredMark;
