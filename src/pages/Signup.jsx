import { Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
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

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (user, { setSubmitting }) => {
    setSubmitting(true);

    const res = await signUp(user);

    if (!res.ok) {
      setSubmitting(false);
      return enqueueSnackbar(res.error, { variant: "error" });
    }

    enqueueSnackbar("Cuenta creada exitosamente", { variant: "success" });
  };

  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Crear una Cuenta
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField
              label="Nombre y Apellido"
              name="name"
              variant="filled"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="filled"
              required
              sx={{ mb: 2 }}
            />
            <PasswordField
              label="Contraseña"
              name="password"
              variant="filled"
              required
              inputProps={{
                minLength: 6,
              }}
              sx={{ mb: 2 }}
            />
            <PasswordField
              label="Confirmar Contraseña"
              name="repeatPassword"
              variant="filled"
              required
              sx={{ mb: 2 }}
            />
            <Typography sx={{ mb: 2 }}>
              ¿Ya tienes cuenta?{" "}
              <Link sx={{ fontWeight: 500 }} to="/login">
                Inicia sesión
              </Link>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                sx={{ width: 120 }}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Registrarse
              </LoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
