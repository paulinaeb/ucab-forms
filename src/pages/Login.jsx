import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { logIn } from "../api/auth";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import Link from "../components/Link";
import Background from "../img/fondo.jpg";
import Logo from "../img/logo.png";

const initialValues = {
  email: "",
  password: "",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Ingresa tu email, por favor")
    .email("Email inválido"),
  password: yup.string().required("Ingresa tu contraseña, por favor"),
});

const onSubmit = async (user, { setSubmitting }) => {
  setSubmitting(true);

  const res = await logIn(user);

  if (!res.ok) {
    setSubmitting(false);
    return alert(res.message);
  }

  alert(res.message);
};

const Login = () => {
  return (
    <Container
      sx={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000000",
        backgroundSize: "cover",

        position: "absolute",
        minWidth: "100%",
        minHeight: "100%",
        backdropFilter: "blur(4px)",

        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h1"
        color="#FFFFFF"
        sx={{
          fontWeight: "450",
          fontSize: "40px",
          textAlign: "center",
          textShadow: "3px 6px 6px rgba(0, 0, 0, 0.8)",
          marginY: "30pt",
        }}
      >
        UCAB Forms
      </Typography>
      <Box
        sx={{
          margin: "auto",
          maxWidth: "430px",
          background: "rgba(14, 14, 14, 0.7)",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h2"
          color="#FFFFFF"
          sx={{
            fontWeight: "450",
            fontSize: "24px",
            marginBottom: "20px",
            textShadow: "3px 6px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          Iniciar sesión
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.90)",
                  marginBottom: "20pt",
                }}
                variant="filled"
              />
              <PasswordField
                label="Contraseña"
                name="password"
                required
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.90)",
                  marginBottom: "20pt",
                }}
                variant="filled"
              />
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Typography
                  sx={{
                    letterSpacing: "0.1px",
                    color: "#FFFFFF",
                    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  ¿No tienes cuenta?{" "}
                  <Link color="#0075f6" sx={{ fontWeight: "500" }} to="/signup">
                    Regístrate
                  </Link>
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Iniciar Sesión
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
