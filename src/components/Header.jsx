import {
  AppBar,
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Notifications, Logout } from "@mui/icons-material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { signOut } from "../api/auth";
import { ReactComponent as Logo } from "../img/logo-header.svg";

const Header = ({ leftIcon }) => {
  const user = useUser();
  const theme = useTheme();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

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
              <Badge badgeContent={17} color="primary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              {...bindTrigger(popupState)}
            >
              <AccountCircle />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                {user.name}
              </MenuItem>
              <Divider />
              <MenuItem onClick={signOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
