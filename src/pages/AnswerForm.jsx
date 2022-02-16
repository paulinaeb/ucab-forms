import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getFormOnce } from "../api/forms";
import { submitResponse, checkUserHasResponses } from "../api/responses";
import {
  CHECKBOX,
  FILE,
  RADIO,
  RATING,
  SLIDER,
  SORTABLE,
} from "../constants/questions";
import { useUser } from "../hooks/useUser";
import Header from "../components/Header";
import Question from "../components/Question";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userHasResponses, setUserHasResponses] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();

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
        console.log(form);
        if (form.settings.onlyOneResponse && !user) {
          setForm(form);
          return setLoading(false);
        }

        randomizeOptionsOrder(form.questions);

        if (form.settings.randomOrder) {
          form.questions.sort(() => Math.random() - 0.5);
        }

        if (form.settings.onlyOneResponse) {
          const hasResponses = await checkUserHasResponses(form.id, user.id);

          setUserHasResponses(hasResponses);
        }

        setForm(form);
        initializeAnswers(form.questions);

        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setResponse((response) => ({
            ...response,
            location: { latitude, longitude },
          }));
        });
      }
      setLoading(false);
    };

    getForm();
  }, [formId, initializeAnswers, user]);

  const submit = async (e) => {
    e.preventDefault();

    let shouldReturn = false;
    const newErrors = { ...errors };

    form.questions.forEach((question) => {
      if (question.required) {
        if (
          ((question.type === CHECKBOX || question.type === FILE) &&
            !answers[question.id].length) ||
          (question.type === RATING && !answers[question.id])
        ) {
          newErrors[question.id] = true;
          shouldReturn = true;
        } else {
          newErrors[question.id] = false;
        }
      }
    });

    setErrors(newErrors);

    if (shouldReturn) {
      return enqueueSnackbar("Aún tienes preguntas por responder", {
        variant: "error",
      });
    }

    setSubmitting(true);

    const responseData = {
      ...response,
      answers: { ...answers },
      comments: {},
    };

    if (form.settings.onlyOneResponse) {
      responseData.user = { ...user };
    }

    const { error } = await submitResponse(form, responseData);

    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      return setSubmitting(false);
    }

    navigate(`/forms/answer/${formId}/sent`);
  };

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

  if (!form.settings.allowResponses) {
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

  if (
    form.settings.maxResponses &&
    form.responses >= form.settings.maxResponses
  ) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            Esta encuesta ya no admite más respuestas
          </Typography>
        </Box>
      </Box>
    );
  }

  if (form.settings.startDate && form.settings.startDate > new Date()) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            Esta encuesta aún no está disponible
          </Typography>
        </Box>
      </Box>
    );
  }

  if (form.settings.endDate && form.settings.endDate < new Date()) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            Esta encuesta ya no está disponible
          </Typography>
        </Box>
      </Box>
    );
  }

  if (form.settings.onlyOneResponse) {
    if (!user) {
      return (
        <Box>
          <Header />
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">
              Debes estar registrado para responder esta encuesta
            </Typography>
          </Box>
        </Box>
      );
    }

    if (userHasResponses) {
      return (
        <Box>
          <Header />
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">
              Ya has respondido esta encuesta
            </Typography>
          </Box>
        </Box>
      );
    }
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
                {errors[question.id] && (
                  <Alert
                    variant="outlined"
                    severity="error"
                    sx={{ mt: 3, border: "none", p: 0 }}
                  >
                    Esta pregunta es requerida
                  </Alert>
                )}
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
