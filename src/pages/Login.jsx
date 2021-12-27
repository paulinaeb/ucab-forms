import { Box, Typography, Button } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import Link from "../components/Link";
import { logIn } from "../api/auth";

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
    <Box>
      <Typography variant="h2">Login</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField label="Email" name="email" type="email" required />
            <PasswordField label="Contraseña" name="password" required />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Iniciar Sesión
            </Button>
            <Typography>
              ¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
