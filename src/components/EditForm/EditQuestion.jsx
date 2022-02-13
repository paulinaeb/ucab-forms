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
  ContentCopy,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Lottie from "lottie-react";
import debounce from "lodash.debounce";
import { useSnackbar } from "notistack";
import {
  questionTypes,
  CHECKBOX,
  FILE,
  RADIO,
  SELECT,
  SORTABLE,
  SLIDER,
  TEXT,
  TEXTAREA,
} from "../../constants/questions";
import {
  deleteQuestion,
  insertQuestion,
  saveQuestion,
} from "../../api/questions";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import EditOptions from "./EditOptions";
import { calculateNewIndex } from "../../utils/questions";
import selectAnimation from "../../img/select.json";

const EditQuestion = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current, setCurrent } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const openAlert = useAlert();

  const question = useMemo(() => {
    return questions.find((q) => q.id === current);
  }, [questions, current]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (newQuestion) => {
        await saveQuestion(form.id, newQuestion);
      }, 1500),
    [form.id]
  );

  return useMemo(() => {
    const needsOptions = (type) => {
      return [RADIO, CHECKBOX, SELECT, SORTABLE].includes(type);
    };

    const handleChange = (field) => (e) => {
      const value = e.target.value;

      const newQuestion = { ...question, [field]: value };

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

      if (type === TEXT || type === TEXTAREA) {
        newQuestion.specialType = "";
      } else {
        newQuestion.specialType = null;
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

      if (type === SORTABLE) {
        newQuestion.required = true;
      }

      if (type === FILE) {
        newQuestion.multipleFiles = false;
      } else {
        newQuestion.multipleFiles = null;
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

    const removeQuestion = (questionId) => {
      openAlert({
        title: "Eliminar pregunta",
        message: "¿Estás seguro de eliminar esta pregunta?",
        action: async () => {
          const { error } = await deleteQuestion(form.id, questionId);

          if (error) {
            return alert(error.message);
          }

          setOpenDrawer(false);
        },
      });
    };

    if (!question) {
      return (
        <Box>
          <Box sx={{ width: "65%", mx: "auto" }}>
            <Lottie animationData={selectAnimation} loop />
          </Box>
          <Typography align="center">
            No hay pregunta seleccionada. ¡Haz click en una para comenzar a
            editar!
          </Typography>
        </Box>
      );
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

    const duplicateQuestion = async (question) => {
      const newIndex = calculateNewIndex(questions, question.id);
      const { id, ...questionData } = question;

      questionData.index = newIndex;

      const { question: newQuestion, error } = await insertQuestion(
        form.id,
        questionData
      );

      if (error) {
        return enqueueSnackbar(error.message, { variant: "error" });
      }

      setCurrent(newQuestion.id);
      setOpenDrawer(true);
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
          onChange={handleChange("title")}
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
          {question.type === FILE && (
            <FormControlLabel
              control={<Checkbox />}
              checked={question.multipleFiles}
              onChange={handleChangeChecked("multipleFiles")}
              label="Múltiples archivos"
            />
          )}
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
              disabled={question.type === SORTABLE}
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Duplicar pregunta</Typography>
            <Tooltip title="Duplicar pregunta" arrow>
              <IconButton onClick={() => duplicateQuestion(question)}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
    );
  }, [
    debouncedSave,
    enqueueSnackbar,
    form.id,
    openAlert,
    question,
    questions,
    setCurrent,
    setOpenDrawer,
    setQuestions,
  ]);
};

export default EditQuestion;
