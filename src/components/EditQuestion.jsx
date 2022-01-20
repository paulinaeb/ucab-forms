import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Container,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  questionTypes,
  CHECKBOX,
  RADIO,
  SELECT,
  SLIDER,
} from "../constants/questions";
import debounce from "lodash.debounce";
import { deleteQuestion, saveQuestion } from "../api/questions";
import { useForm } from "../hooks/useForm";
import QuestionPreview from "./QuestionPreview";

const EditQuestion = ({ question, tabIndex }) => {
  const { form, setQuestions } = useForm();
  const [focused, setFocused] = useState(false);

  const debouncedSave = useMemo(
    () =>
      debounce(async (newQuestion) => {
        await saveQuestion(form.id, newQuestion);
        alert("Pregunta guardada");
      }, 3000),
    [form.id]
  );

  return useMemo(() => {
    const handleChangeTitle = (e) => {
      const title = e.target.value;

      const newQuestion = { ...question, title };

      debouncedSave(newQuestion);

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

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleChangeRequired = (e) => {
      const required = e.target.checked;

      const newQuestion = { ...question, required };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const removeQuestion = async (questionId) => {
      const { error } = await deleteQuestion(form.id, questionId);

      if (error) {
        return alert(error.message);
      }

      alert("Pregunta eliminada");
    };

    const requiredMark = question.required && (
      <Typography component="span" color="error">
        {" "}
        *
      </Typography>
    );

    return (
      <Card
        sx={{ p: 3 }}
        tabIndex={tabIndex}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        elevation={focused ? 5 : 0}
        variant={focused ? "elevation" : "outlined"}
      >
        <Typography mb={2}>
          {question.title}
          {requiredMark}
        </Typography>
        {/* <Container
            sx={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Typography variant="h5" sx={{ width: 300, mt: 1 }}>
              Titulo de la pregunta
            </Typography>

            <Container sx={{ justifyContent: "flex-end", display: "flex" }}>
              <FormControlLabel
                control={<Checkbox />}
                checked={question.required}
                onChange={handleChangeRequired}
                label="Obligatoria"
              />

              <IconButton
                aria-label="eliminar pregunta"
                onClick={() => removeQuestion(question.id)}
              >
                <Delete />
              </IconButton>
            </Container>
          </Container> */}
        <QuestionPreview question={question} />
      </Card>

      /*<Card>
        <TextField
          variant="filled"
          multiline
          placeholder="Título de la pregunta"
          value={question.title}
          onChange={handleChangeTitle}
        />

        <TextField
          variant="filled"
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
        <QuestionPreview question={question} />
        <FormControlLabel
          control={<Checkbox />}
          checked={question.required}
          onChange={handleChangeRequired}
          label="Obligatoria"
        />
        <IconButton
          aria-label="eliminar pregunta"
          onClick={() => removeQuestion(question.id)}
        >
          <Delete />
        </IconButton>
      </Card>*/
    );
  }, [debouncedSave, focused, form.id, question, setQuestions, tabIndex]);
};

export default EditQuestion;
