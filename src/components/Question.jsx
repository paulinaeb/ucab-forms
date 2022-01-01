import { useEffect, memo } from "react";
import { Card, TextField, MenuItem } from "@mui/material";
import { saveQuestion } from "../api/forms";
import useAutoSave from "../hooks/useAutoSave";
import QuestionPreview from "./QuestionPreview";

const questionTypes = [
  {
    value: "text",
    label: "Respuesta breve",
  },
  {
    value: "textarea",
    label: "Respuesta larga",
  },
  {
    value: "radio",
    label: "Opción múltiple",
  },
  {
    value: "checkbox",
    label: "Casillas de verificación",
  },
];

const Question = ({ formId, question, setQuestions }) => {
  const autoSave = useAutoSave();

  const handleChangeTitle = (e) => {
    const title = e.target.value;

    const newQuestion = { ...question, title };

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const handleChangeType = (e) => {
    const type = e.target.value;

    const newQuestion = { ...question, type };

    if (type !== "radio" && type !== "checkbox") {
      delete newQuestion.options;
    }

    if (!newQuestion.options && (type === "radio" || type === "checkbox")) {
      newQuestion.options = ["Opción 1"];
    }

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  return (
    <Card>
      <TextField
        variant="standard"
        multiline
        placeholder="Título de la pregunta"
        value={question.title}
        onChange={handleChangeTitle}
      />
      <TextField
        variant="outlined"
        select
        value={question.type}
        onChange={handleChangeType}
      >
        {questionTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>
      <QuestionPreview
        formId={formId}
        question={question}
        setQuestions={setQuestions}
      />
    </Card>
  );
};

export default memo(Question);
