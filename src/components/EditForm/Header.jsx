import { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import {
  Menu as MenuIcon,
  MoreVert,
  Send,
  Settings,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import SettingsDialog from "./SettingsDialog";
import SendDialog from "./SendDialog";
import Header from "../Header";

const EditFormHeader = ({ setOpenDrawer }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const [openSettings, setOpenSettings] = useState(false);
  const [openSend, setOpenSend] = useState(false);

  const popupStateMore = usePopupState({
    variant: "popover",
    popupId: "more-menu-aaaa",
  });

  const handleClickOpenSettings = () => {
    popupStateMore.close();
    setOpenSettings(true);
  };

  const handleClickOpenSend = () => {
    popupStateMore.close();
    setOpenSend(true);
  };

  const toggleDrawer = () => {
    setOpenDrawer((openDrawer) => !openDrawer);
  };

  return (
    <>
      <Header
        leftIcons={
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        }
        rightIcons={
          upMd && (
            <>
              <Tooltip title="Configuración" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleClickOpenSettings}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                sx={{ px: 3, ml: 1, mr: 2 }}
                onClick={handleClickOpenSend}
              >
                Enviar
              </Button>
            </>
          )
        }
        moreMenu={
          !upMd && (
            <>
              <Tooltip title="Más" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  edge="end"
                  {...bindTrigger(popupStateMore)}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu {...bindMenu(popupStateMore)} disableEnforceFocus>
                <MenuItem onClick={handleClickOpenSend}>
                  <ListItemIcon>
                    <Send fontSize="small" />
                  </ListItemIcon>
                  Enviar
                </MenuItem>
                <MenuItem onClick={handleClickOpenSettings}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Configuración
                </MenuItem>
              </Menu>
            </>
          )
        }
      />
      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
      <SendDialog open={openSend} setOpen={setOpenSend} />
    </>
  );
};

export default EditFormHeader;
