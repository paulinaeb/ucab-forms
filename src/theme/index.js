import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          "*::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "*::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "*::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "*::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "*::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
  palette: {
    // mode: "dark",
  },
});

export default theme;
