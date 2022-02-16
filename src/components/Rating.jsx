import { useState } from "react";
import { Box, Rating as MuiRating, Typography } from "@mui/material";
import { ratingLabels } from "../constants/questions";

const Rating = ({
  value,
  onChange,
  readOnly,
  ratingProps,
  typographyProps,
  boxProps,
  boxSx,
}) => {
  const [hover, setHover] = useState(-1);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, ...boxSx }}
      {...boxProps}
    >
      <MuiRating
        value={value}
        onChange={(event, newValue) => {
          setHover(-1);
          onChange(event, newValue);
        }}
        readOnly={readOnly}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        {...ratingProps}
      />
      <Typography {...typographyProps}>
        {ratingLabels[hover !== -1 ? hover : value]}
      </Typography>
    </Box>
  );
};

export default Rating;
