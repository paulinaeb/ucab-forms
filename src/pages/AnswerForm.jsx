import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getForm } from "../api/forms";
import { getQuestions } from "../api/questions";
import { submitResponse } from "../api/responses";
import { CHECKBOX, RADIO, SLIDER } from "../constants/questions";
import Header from "../components/Header";
import Question from "../components/Question";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState();
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const initializeAnswers = useCallback((questions) => {
    const answers = {};

    questions.forEach((question) => {
      if (question.type === CHECKBOX) {
        answers[question.id] = [];
      } else if (question.type === RADIO && question.required) {
        answers[question.id] = question.options[0];
      } else if (question.type === SLIDER) {
        answers[question.id] = question.min;
      } else {
        answers[question.id] = "";
      }
    });

    setAnswers(answers);
  }, []);

  useEffect(() => {
    const unsubscribeForm = getForm(formId, (form) => {
      setForm(form);
      setLoadingForm(false);
    });

    const unsubscribeQuestions = getQuestions(formId, (questions) => {
      if (!answers) {
        initializeAnswers(questions);
      }

      setQuestions(questions);
    });

    return () => {
      unsubscribeForm();
      unsubscribeQuestions();
    };
  }, [answers, formId, initializeAnswers]);

  const submit = async (e) => {
    e.preventDefault();

    questions.forEach((question) => {
      if (
        question.type === CHECKBOX &&
        question.required &&
        !answers[question.id].length
      ) {
        // TODO
        return alert(
          "La pregunta tal es requerida, selecciona al menos una opción"
        );
      }
    });

    setSubmitting(true);

    const { error } = await submitResponse(formId, answers);

    if (error) {
      alert(error.message);
      return setSubmitting(false);
    }

    navigate("/"); // TODO
  };

  if (loadingForm) {
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
            {questions.map((question, i) => (
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
                onClick={() => initializeAnswers(questions)}
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
