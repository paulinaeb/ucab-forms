import {
  AppBar,
  Badge,
  Box,
  IconButton,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Notifications } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../img/logo-header.svg";

const Header = ({ leftIcon }) => {
  const theme = useTheme();

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>{leftIcon}</Box>
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <SvgIcon sx={{ mr: 1 }}>
              <Logo />
            </SvgIcon>
            <Typography variant="h6" component="h1" textAlign="center">
              UCAB Forms
            </Typography>
          </Box>
          <Box>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton size="large" edge="end" color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
