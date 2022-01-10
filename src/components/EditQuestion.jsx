import { memo } from "react";
import {
  Card,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import {
  questionTypes,
  CHECKBOX,
  RADIO,
  SELECT,
  SLIDER,
} from "../constants/questions";
import { saveQuestion } from "../api/questions";
import useAutoSave from "../hooks/useAutoSave";
import QuestionPreview from "./QuestionPreview";

const EditQuestion = ({ formId, question, setQuestions }) => {
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

    const needsOptions = [RADIO, CHECKBOX, SELECT].includes(type);

    if (!needsOptions) {
      newQuestion.options = null;
    }

    if (!newQuestion.options && needsOptions) {
      newQuestion.options = ["Opción 1"];
    }

    if (type !== SLIDER) {
      newQuestion.min = null;
      newQuestion.max = null;
      newQuestion.minLabel = null;
      newQuestion.maxLabel = null;
    }

    if (type === SLIDER) {
      newQuestion.min = 1;
      newQuestion.max = 5;
    }

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const handleChangeRequired = (e) => {
    const required = e.target.checked;

    const newQuestion = { ...question, required };

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
      <FormControlLabel
        control={<Switch />}
        checked={question.required}
        onChange={handleChangeRequired}
        label="Obligatoria"
      />
    </Card>
  );
};

export default memo(EditQuestion);
