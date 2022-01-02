import { memo } from "react";
import { Box, Button } from "@mui/material";
import { defaultQuestion, insertQuestion, deleteQuestion } from "../api/forms";
import EditQuestion from "./EditQuestion";

const EditQuestionsList = ({ formId, questions, setQuestions }) => {
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

    const { error } = await insertQuestion(formId, question);

    if (error) {
      return alert(error.message);
    }

    alert("Pregunta agregada");
  };

  const removeQuestion = async (questionId) => {
    const { error } = await deleteQuestion(formId, questionId);

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
          <EditQuestion
            formId={formId}
            question={question}
            setQuestions={setQuestions}
          />
          <Button onClick={() => addQuestionAfter(i)}>Add question</Button>
          <Button onClick={() => removeQuestion(question.id)}>
            Delete question
          </Button>
        </Box>
      ))}
    </>
  );
};

export default memo(EditQuestionsList);
