import { Box, Button, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { signUp } from "../api/auth";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import Link from "../components/Link";

const initialValues = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Ingresa tu nombre, por favor"),
  email: yup
    .string()
    .required("Ingresa tu email, por favor")
    .email("Email inválido"),
  password: yup
    .string()
    .required("Ingresa una contraseña, por favor")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  repeatPassword: yup
    .string()
    .required("Ingresa tu contraseña nuevamente, por favor")
    .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden"),
});

const onSubmit = async (user, { setSubmitting }) => {
  setSubmitting(true);

  const res = await signUp(user);

  if (!res.ok) {
    setSubmitting(false);
    return alert(res.message);
  }

  alert(res.message);
};

const Signup = () => {
  return (
    <Box>
      <Typography variant="h2">Signup</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField label="Nombre" name="name" required />
            <TextField label="Email" name="email" type="email" required />
            <PasswordField
              label="Contraseña"
              name="password"
              required
              inputProps={{
                minLength: 6,
              }}
            />
            <PasswordField
              label="Repetir Contraseña"
              name="repeatPassword"
              required
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Registrarse
            </Button>
            <Typography>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Signup;
