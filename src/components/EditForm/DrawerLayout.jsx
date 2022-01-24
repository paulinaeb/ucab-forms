import { Box, Container, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditQuestion from "./EditQuestion";

const drawerWidth = 350;

const DrawerLayout = ({ open, setOpen, children }) => {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
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
          <EditQuestion setOpenDrawer={setOpen} />
        </Box>
      </Drawer>
      <Container sx={{ p: 3 }} maxWidth="md">
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
