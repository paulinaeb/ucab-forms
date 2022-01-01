import { useEffect, memo } from "react";
import { Card, TextField, MenuItem } from "@mui/material";

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
];

const Question = ({ question, setQuestions }) => {
  const handleChangeTitle = (e) => {
    const title = e.target.value;

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? { ...q, title } : q))
    );
  };

  const handleChangeType = (e) => {
    const type = e.target.value;

    setQuestions((questions) =>
      questions.map((q) => {
        if (q.id === question.id) {
          const newQuestion = { ...q, type };

          if (type === "radio") {
            newQuestion.options = ["Opción 1"];
          }

          return newQuestion;
        }

        return q;
      })
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
    </Card>
  );
};

export default memo(Question);
