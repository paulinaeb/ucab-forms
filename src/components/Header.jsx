import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Tooltip,
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
import HeaderLogo from "./HeaderLogo";

const Header = ({ leftIcons, rightIcons, moreMenu }) => {
  const user = useUser();
  const theme = useTheme();
  const popupStateUser = usePopupState({
    variant: "popover",
    popupId: "user-menu",
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
                  <IconButton size="large" color="inherit">
                    <Badge badgeContent={17} color="primary">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
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
                {moreMenu}
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
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
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
