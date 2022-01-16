import { useMemo } from "react";
import { Box, Button } from "@mui/material";
import { defaultQuestion } from "../constants/questions";
import { useForm } from "../hooks/useForm";
import { deleteQuestion, insertQuestion } from "../api/questions";
import EditQuestion from "./EditQuestion";

const EditQuestionsList = () => {
  const { form, questions } = useForm();

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

    const removeQuestion = async (questionId) => {
      const { error } = await deleteQuestion(form.id, questionId);

      if (error) {
        return alert(error.message);
      }

      alert("Pregunta eliminada");
    };

    return (
      <>
        <Button onClick={() => addQuestionAfter(-1)}>Agregar pregunta</Button>
        {questions.map((question, i) => (
          <Box key={i}>
            <EditQuestion question={question} />
            <Button onClick={() => addQuestionAfter(i)}>Add question</Button>
            <Button onClick={() => removeQuestion(question.id)}>
              Delete question
            </Button>
          </Box>
        ))}
      </>
    );
  }, [questions, form.id]);
};

export default EditQuestionsList;
