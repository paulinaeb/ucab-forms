import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getForm, getQuestions, submitAnswers } from "../api/forms";
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

    const unsubscribeQuestions = getQuestions(formId, (changes) => {
      setQuestions((oldQuestions) => {
        const questions = [...oldQuestions];

        changes.forEach((change) => {
          if (change.type === "added") {
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "modified") {
            questions.splice(change.oldIndex, 1);
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "removed") {
            questions.splice(change.oldIndex, 1);
          }
        });

        return questions;
      });
    });

    return () => {
      unsubscribeForm();
      unsubscribeQuestions();
    };
  }, [formId]);

  const submit = async (e) => {
    e.preventDefault();

    const { error } = await submitAnswers(formId, answers);

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

  return (
    <Box>
      <Typography variant="h1">Answer Form</Typography>
      <Typography variant="h2">{form.title}</Typography>
      <Typography variant="h3">{form.description}</Typography>
      <form onSubmit={submit}>
        {questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

export default AnswerForm;
