import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { signOut } from "../api/auth";
import HeaderLogo from "./HeaderLogo";

const Header = ({ leftIcons, rightIcons, moreMenu }) => {
  const user = useUser();
  const theme = useTheme();

  const popupStateUser = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

  const popupStateNotifications = usePopupState({
    variant: "popover",
    popupId: "notifications-menu",
  });

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {leftIcons}
            <HeaderLogo
              sx={{
                position: { sm: "absolute" },
                top: { sm: "50%" },
                left: { sm: "50%" },
                transform: { sm: "translate(-50%, -50%)" },
              }}
            />
          </Box>
          <Box>
            {rightIcons}
            {user ? (
              <>
                <Tooltip title="Notificaciones" arrow>
                  <IconButton
                    size="large"
                    color="inherit"
                    {...bindTrigger(popupStateNotifications)}
                  >
                    <Badge badgeContent={17} color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  PaperProps={{
                    style: {
                      maxHeight: 300,
                      maxWidth: "30ch",
                    },
                  }}
                  {...bindMenu(popupStateNotifications)}
                >
                  <MenuItem sx={{ whiteSpace: "pre-wrap" }}>
                    Alguien ha respondido tu encuesta "Razones por las cuales no
                    ir al cine hoy en día"
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ whiteSpace: "pre-wrap" }}>
                    Alguien ha respondido tu encuesta "No es cuestión de
                    aquello"
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ whiteSpace: "pre-wrap" }}>
                    Alguien ha respondido tu encuesta "Qué pasa ehhh"
                  </MenuItem>
                </Menu>
                <Tooltip title="Usuario" arrow>
                  <IconButton
                    size="large"
                    color="inherit"
                    edge="end"
                    {...bindTrigger(popupStateUser)}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu {...bindMenu(popupStateUser)}>
                  <MenuItem onClick={popupStateUser.close}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    {user.name}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={signOut}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
                {moreMenu}
              </>
            ) : (
              <>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to="/login"
                >
                  Ingresar
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
