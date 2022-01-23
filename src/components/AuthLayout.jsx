import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import Background from "../img/fondo.jpg";
import Logo from "../img/logo.png";

const AuthLayout = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "common.black",
        backgroundSize: "cover",
        display: "flex",
        minHeight: "100vh",
        backdropFilter: "blur(4px)",
        alignItems: "center",
        justifyContent: "center",
        color: "common.white",
        px: 1,
        pt: 2,
        pb: 4,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box component="img" src={Logo} alt="logo" sx={{ width: 110 }} />
          <Typography
            component="h1"
            align="center"
            sx={{
              fontWeight: 450,
              fontSize: 40,
              textShadow: "3px 6px 6px rgba(0, 0, 0, 0.8)",
            }}
          >
            UCAB Forms
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: 430,
            background: "rgba(14, 14, 14, 0.7)",
            boxShadow: 3,
            borderRadius: 2.5,
            p: 4,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
