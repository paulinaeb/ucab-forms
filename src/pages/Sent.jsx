import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Card,
  LinearProgress,
  Typography,
} from "@mui/material";
import Lottie from "lottie-react";
import { getFormOnce } from "../api/forms";
import Header from "../components/Header";
import doneAnimation from "../img/done.json";

const Sent = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForm = async () => {
      const form = await getFormOnce(formId);
      setForm(form);

      setLoading(false);
    };

    getForm();
  }, [formId]);

  if (loading) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">No se encontró la encuesta</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Container sx={{ p: 3 }} maxWidth="md">
        <Card
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          variant="outlined"
        >
          <Typography align="center" variant="h5">
            Enviada
          </Typography>
          <Box sx={{ width: "40vmin" }}>
            <Lottie animationData={doneAnimation} />
          </Box>
          <Typography align="center" mb={2}>
            ¡Gracias por tu colaboración! Hemos recibido tu respuesta con éxito.
          </Typography>
          {!form.settings.onlyOneResponse && (
            <Button
              variant="contained"
              component={Link}
              to={`/forms/answer/${formId}`}
            >
              Enviar otra respuesta
            </Button>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Sent;
