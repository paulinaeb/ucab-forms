import { useState, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { getForm, getQuestions, saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import useAutoSave from "../hooks/useAutoSave";
import QuestionsList from "../components/QuestionsList";

const EditForm = () => {
  const user = useUser();
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const autoSave = useAutoSave();

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
    const value = e.target.value;
    const newForm = { ...form, [field]: value };

    autoSave(async () => {
      await saveForm(newForm);
      alert("Encuesta guardada");
    });

    setForm(newForm);
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
