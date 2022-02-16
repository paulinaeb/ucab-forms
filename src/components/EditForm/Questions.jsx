import { useMemo } from "react";
import { Box, Button, Fab, Stack, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { defaultQuestion } from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import { insertQuestion } from "../../api/questions";
import QuestionPreview from "./QuestionPreview";
import { calculateNewIndex } from "../../utils/questions";

const Questions = ({ setOpenDrawer }) => {
  const { form, questions, current, setCurrent } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  return useMemo(() => {
    const addQuestion = async () => {
      const newIndex = calculateNewIndex(questions, current);

      const newQuestion = { index: newIndex, ...defaultQuestion };

      const { question, error } = await insertQuestion(form.id, newQuestion);

      if (error) {
        return enqueueSnackbar(error.message, { variant: "error" });
      }

      setCurrent(question.id);
      setOpenDrawer(true);
    };

    return (
      <Box>
        {!questions.length && <Typography>No hay preguntas</Typography>}
        <Stack spacing={2}>
          {questions.map((question, i) => (
            <QuestionPreview
              key={i}
              question={question}
              setOpenDrawer={setOpenDrawer}
            />
          ))}
        </Stack>
        <Tooltip title="Agregar pregunta" arrow>
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: "8%", right: "5%" }}
            onClick={addQuestion}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>
    );
  }, [current, enqueueSnackbar, form.id, questions, setCurrent, setOpenDrawer]);
};

export default Questions;
