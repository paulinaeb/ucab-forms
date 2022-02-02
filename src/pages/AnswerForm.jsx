import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getFormOnce } from "../api/forms";
import { submitResponse } from "../api/responses";
import {
  CHECKBOX,
  FILE,
  RADIO,
  RATING,
  SLIDER,
  SORTABLE,
} from "../constants/questions";
import Header from "../components/Header";
import Question from "../components/Question";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [response, setResponse] = useState({});
  const [answers, setAnswers] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const initializeAnswers = useCallback((questions) => {
    const answers = {};

    questions.forEach((question) => {
      if (question.type === CHECKBOX || question.type === FILE) {
        answers[question.id] = [];
      } else if (question.type === RADIO && question.required) {
        answers[question.id] = question.options[0];
      } else if (question.type === SLIDER) {
        answers[question.id] = question.min;
      } else if (question.type === SORTABLE) {
        answers[question.id] = [...question.options];
      } else if (question.type === RATING) {
        answers[question.id] = 0;
      } else {
        answers[question.id] = "";
      }
    });

    setAnswers(answers);
  }, []);

  useEffect(() => {
    const randomizeOptionsOrder = (questions) => {
      questions.forEach((question) => {
        if (question.randomOrder) {
          question.options.sort(() => Math.random() - 0.5);
        }
      });
    };

    const getForm = async () => {
      const form = await getFormOnce(formId);
      if (form) {
        randomizeOptionsOrder(form.questions);
        setForm(form);
        initializeAnswers(form.questions);
      }
      setLoading(false);
    };

    getForm();
  }, [formId, initializeAnswers]);

  const submit = async (e) => {
    e.preventDefault();

    form.questions.forEach((question) => {
      if (
        (question.type === CHECKBOX || question.type === FILE) &&
        question.required &&
        !answers[question.id].length
      ) {
        // TODO
        return alert(
          "La pregunta tal es requerida, selecciona al menos una opción"
        );
      }
      if (
        question.type === RATING &&
        question.required &&
        !answers[question.id]
      ) {
        // TODO
        return alert("La pregunta tal es requerida");
      }
    });

    setSubmitting(true);

    const responseData = {
      ...response,
      answers: { ...answers },
    };

    const { error } = await submitResponse(form, responseData);

    if (error) {
      alert(error.message);
      return setSubmitting(false);
    }

    navigate("/"); // TODO
  };

  if (loading) {
    return <Typography variant="h2">Loading...</Typography>;
  }

  if (!form) {
    return <Typography variant="h2">No se encontró la encuesta</Typography>;
  }

  if (!form.settings.allowAnswers) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            Esta encuesta no admite respuestas
          </Typography>
        </Box>
      </Box>
    );
  }

  console.log(answers);

  return (
    <Box>
      <Header />
      <Container sx={{ p: 3 }} maxWidth="md">
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }} variant="outlined">
              <Typography variant="h5" mb={2}>
                {form.title}
              </Typography>
              <Typography mb={2}>{form.description}</Typography>
              <Typography color="error" variant="caption">
                * Obligatorio
              </Typography>
            </Card>
            {form.questions.map((question, i) => (
              <Card key={i} sx={{ p: 3 }} variant="outlined">
                <Question
                  question={question}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              </Card>
            ))}
          </Stack>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: { sm: "space-between" },
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: { sm: 1 }, mr: { sm: 2 } }}
            >
              Nunca envíes contraseñas a través de UCAB Forms
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexShrink: 0,
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
              }}
            >
              <Button
                sx={{ px: 1, mr: 2 }}
                onClick={() => initializeAnswers(form.questions)}
              >
                Borrar respuestas
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                variant="contained"
                sx={{ px: 5 }}
              >
                Enviar
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AnswerForm;
