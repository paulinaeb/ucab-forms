import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getForm,
  getQuestions,
  saveForm,
  insertQuestion,
  defaultQuestion,
  updateForm,
} from "../api/forms";
import { useUser } from "../hooks/useUser";
import QuestionsList from "../components/QuestionsList";

const EditForm = () => {
  const user = useUser();
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const unsubscribeForms = getForm(formId, (form) => {
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
      unsubscribeForms();
      unsubscribeQuestions();
    };
  }, [formId]);

  const handleChange = (field) => (e) => {
    clearTimeout(timeoutId);
    const value = e.target.value;
    const newForm = { ...form, [field]: value };

    const id = setTimeout(async () => {
      await updateForm(newForm);
      alert("Encuesta guardada");
    }, 2000);

    setTimeoutId(id);
    setForm(newForm);
  };

  const save = async () => {
    const saved = await saveForm(form, questions);

    if (saved) {
      return alert("Encuesta guardada");
    }

    alert("Error al guardar la encuesta");
  };

  if (loadingForm) {
    return <Typography variant="h2">Loading...</Typography>;
  }

  if (!form) {
    return <Typography variant="h2">No se encontró la encuesta</Typography>;
  }

  if (form.userId !== user.id) {
    return <Typography variant="h2">No autorizado</Typography>;
  }

  return (
    <Box>
      <Typography variant="h2">Edit Form</Typography>
      <TextField
        variant="standard"
        multiline
        placeholder="Título de la encuesta"
        value={form.title}
        onChange={handleChange("title")}
      />
      <TextField
        variant="standard"
        multiline
        placeholder="Descripción de la encuesta"
        value={form.description}
        onChange={handleChange("description")}
      />
      <Button onClick={save}>Save</Button>
      <Typography variant="h2">Questions</Typography>
      <QuestionsList
        formId={formId}
        questions={questions}
        setQuestions={setQuestions}
      />
    </Box>
  );
};

export default EditForm;
