import {
  AppBar,
  Badge,
  Box,
  CssBaseline,
  Container,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  Inbox,
  Mail,
  Menu,
  Notifications,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Drawer from "./Drawer";

const drawerWidth = 350;

const DrawerLayout = ({ open, setOpen, children }) => {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={bigScreen ? "permanent" : "temporary"}
        open={bigScreen ? true : open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <Drawer setOpenDrawer={setOpen} />
        </Box>
      </MuiDrawer>
      <Container sx={{ p: 3 }} maxWidth="md">
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
