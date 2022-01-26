import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import logo from "../img/logo.svg";

const blink = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
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
        animation: `${blink} 1s infinite alternate`,
        p: 2,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{ width: "100%", maxWidth: "md" }}
      />
    </Box>
  );
};

export default Loading;
