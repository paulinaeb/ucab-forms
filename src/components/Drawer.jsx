import { useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import debounce from "lodash.debounce";
import {
  questionTypes,
  CHECKBOX,
  RADIO,
  SELECT,
  SLIDER,
} from "../constants/questions";
import { deleteQuestion, saveQuestion } from "../api/questions";
import { useForm } from "../hooks/useForm";
import Options from "./Options";

const Drawer = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current } = useForm();

  const question = useMemo(() => {
    return questions.find((q) => q.id === current);
  }, [questions, current]);

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

      setOpenDrawer(false);
      alert("Pregunta eliminada");
    };

    if (!question) {
      return <Box>No hay pregunta seleccionada</Box>;
    }

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Editar pregunta</Typography>
        <TextField
          variant="standard"
          multiline
          label="Título de la pregunta"
          value={question.title}
          onChange={handleChangeTitle}
        />
        <TextField
          variant="standard"
          select
          label="Tipo de pregunta"
          value={question.type}
          onChange={handleChangeType}
        >
          {questionTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <Options question={question} debouncedSave={debouncedSave} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        </Box>
      </Stack>
    );
  }, [debouncedSave, form.id, question, setQuestions]);
};

export default Drawer;
