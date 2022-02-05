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
import { getFormOnce } from "../api/forms";
import Header from "../components/Header";

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
        <Card sx={{ p: 3 }} variant="outlined">
          <Typography variant="h5" mb={2}>
            {form.title}
          </Typography>
          <Typography mb={2}>
            Tu respuesta ha sido enviada exitosamente. Gracias por responder la
            encuesta.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to={`/forms/answer/${formId}`}
          >
            Enviar otra respuesta
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default Sent;
