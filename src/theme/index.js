import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0a0a0a",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#6bc4eb",
    },
  },
});

export default theme;
