import { useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import debounce from "lodash.debounce";
import {
  questionTypes,
  CHECKBOX,
  RADIO,
  SELECT,
  SLIDER,
} from "../../constants/questions";
import { deleteQuestion, saveQuestion } from "../../api/questions";
import { useForm } from "../../hooks/useForm";
import EditOptions from "./EditOptions";

const EditQuestion = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current } = useForm();

  const question = useMemo(() => {
    return questions.find((q) => q.id === current);
  }, [questions, current]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (newQuestion) => {
        await saveQuestion(form.id, newQuestion);
      }, 2000),
    [form.id]
  );

  return useMemo(() => {
    const needsOptions = (type) => {
      return [RADIO, CHECKBOX, SELECT].includes(type);
    };

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

      if (!needsOptions(type)) {
        newQuestion.options = null;
        newQuestion.randomOrder = null;
      }

      if (!newQuestion.options && needsOptions(type)) {
        newQuestion.options = ["Opción 1"];
        newQuestion.randomOrder = false;
      }

      const needsOther = [RADIO, CHECKBOX].includes(type);

      if (!needsOther) {
        newQuestion.other = null;
      }

      if (newQuestion.other === null && needsOther) {
        newQuestion.other = false;
      }

      if (type === SLIDER) {
        newQuestion.min = 1;
        newQuestion.max = 5;
      } else {
        newQuestion.min = null;
        newQuestion.max = null;
        newQuestion.minLabel = null;
        newQuestion.maxLabel = null;
      }

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleChangeChecked = (field) => (e) => {
      const checked = e.target.checked;

      const newQuestion = { ...question, [field]: checked };

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
    };

    if (!question) {
      return <Box>No hay pregunta seleccionada</Box>;
    }

    const swapQuestion = (direction) => {
      const i = questions.indexOf(question);
      const j = direction === "up" ? i - 1 : i + 1;
      const k = direction === "up" ? i - 2 : i + 2;

      let newIndex;

      if (!questions[k]) {
        newIndex = questions[j].index + (direction === "up" ? -1 : 1);
      } else {
        newIndex = (questions[j].index + questions[k].index) / 2;
      }

      const newQuestion = { ...question, index: newIndex };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Editar pregunta</Typography>
          <Box>
            <Tooltip title="Mover arriba" arrow>
              <span>
                <IconButton
                  disabled={question === questions[0]}
                  onClick={() => swapQuestion("up")}
                >
                  <ArrowUpward />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Mover abajo" arrow>
              <span>
                <IconButton
                  disabled={question === questions[questions.length - 1]}
                  onClick={() => swapQuestion("down")}
                >
                  <ArrowDownward />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
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
        <EditOptions question={question} debouncedSave={debouncedSave} />
        <Box>
          {needsOptions(question.type) && (
            <FormControlLabel
              control={<Checkbox />}
              checked={question.randomOrder}
              onChange={handleChangeChecked("randomOrder")}
              label="Orden aleatorio"
            />
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={<Checkbox />}
              checked={question.required}
              onChange={handleChangeChecked("required")}
              label="Obligatoria"
            />
            <Tooltip title="Eliminar pregunta" arrow>
              <IconButton onClick={() => removeQuestion(question.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
    );
  }, [
    debouncedSave,
    form.id,
    question,
    questions,
    setOpenDrawer,
    setQuestions,
  ]);
};

export default EditQuestion;
