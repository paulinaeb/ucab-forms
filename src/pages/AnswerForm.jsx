import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getForm } from "../api/forms";
import { getQuestions } from "../api/questions";
import { submitResponse } from "../api/responses";
import Header from "../components/Header";
import Question from "../components/Question";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingForm, setLoadingForm] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeForm = getForm(formId, (form) => {
      setForm(form);
      setLoadingForm(false);
    });

    const unsubscribeQuestions = getQuestions(formId, (questions) => {
      setQuestions(questions);
    });

    return () => {
      unsubscribeForm();
      unsubscribeQuestions();
    };
  }, [formId]);

  const submit = async (e) => {
    e.preventDefault();

    const { error } = await submitResponse(formId, answers);

    if (error) {
      alert(error.message);
    }

    alert("Encuesta enviada");
    navigate("/");
  };

  if (loadingForm) {
    return <Typography variant="h2">Loading...</Typography>;
  }

  if (!form) {
    return <Typography variant="h2">No se encontró la encuesta</Typography>;
  }

  console.log(answers);

  return (
    <Box>
      <Header />
      <Container sx={{ p: 3 }} maxWidth="md">
        <Card sx={{ p: 3, mb: 2 }} variant="outlined">
          <Typography variant="h5" gutterBottom>
            {form.title}
          </Typography>
          <Typography>{form.description}</Typography>
        </Card>
        <form onSubmit={submit}>
          <Stack spacing={2}>
            {questions.map((question, i) => (
              <Card key={i} sx={{ p: 3 }} variant="outlined">
                <Question
                  question={question}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              </Card>
            ))}
            <Button type="submit" variant="contained">
              Enviar
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default AnswerForm;
