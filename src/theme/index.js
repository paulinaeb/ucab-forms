import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f5f5f5",
        },
        html: {
          "*::-webkit-scrollbar": {
            width: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "5px",
          },
          "*::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#999",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#b3b3b3",
            boxShadow: "0 0 2px 1px rgba(0, 0, 0, 0.2)",
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: "e1e1e1",
            borderRadius: "5px",
          },
          "*::-webkit-scrollbar-track:hover , *::-webkit-scrollbar-track:active":
            {
              backgroundColor: "d4d4d4",
            },
        },
      },
    },
  },
  palette: {
    mode: "dark",
  },
});

export default theme;
