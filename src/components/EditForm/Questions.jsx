import { useMemo } from "react";
import { Box, Button, Fab, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { defaultQuestion } from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import { insertQuestion } from "../../api/questions";
import QuestionPreview from "./QuestionPreview";

const Questions = ({ setOpenDrawer }) => {
  const { form, questions, current, setCurrent } = useForm();

  return useMemo(() => {
    const addQuestionAfter = async (i) => {
      let newIndex;

      if (i === -1) {
        newIndex = questions[0] ? questions[0].index - 1 : 0;
      } else if (i === questions.length - 1) {
        newIndex = questions[i].index + 1;
      } else {
        newIndex = (questions[i].index + questions[i + 1].index) / 2;
      }

      const question = { index: newIndex, ...defaultQuestion };

      const { error } = await insertQuestion(form.id, question);

      if (error) {
        return alert(error.message);
      }

      alert("Pregunta agregada");
    };

    const addQuestion = async () => {
      const i = questions.findIndex((q) => q.id === current);
      let newIndex;

      if (i === questions.length - 1 || i === -1) {
        newIndex = questions[questions.length - 1].index + 1;
      } else {
        newIndex = (questions[i].index + questions[i + 1].index) / 2;
      }

      const newQuestion = { index: newIndex, ...defaultQuestion };

      const { question, error } = await insertQuestion(form.id, newQuestion);

      if (error) {
        return alert(error.message);
      }

      setCurrent(question.id);
      setOpenDrawer(true);
    };

    return (
      <Box>
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
  }, [current, form.id, questions, setCurrent, setOpenDrawer]);
};

export default Questions;
