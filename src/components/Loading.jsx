import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const blink = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Loading = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: `${blink} 2s infinite ease`,
      }}
    >
      <Typography variant="h1" textAlign="center">
        UCAB Forms
      </Typography>
    </Box>
  );
};

export default Loading;
