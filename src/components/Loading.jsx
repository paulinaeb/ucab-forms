import { Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">Loading...</Typography>
    </Box>
  );
};

export default Loading;
