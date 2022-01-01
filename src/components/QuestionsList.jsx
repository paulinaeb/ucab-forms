import { memo } from "react";
import { Box, Button } from "@mui/material";
import { defaultQuestion, insertQuestion } from "../api/forms";
import Question from "../components/Question";

const QuestionsList = ({ formId, questions, setQuestions }) => {
  const addQuestionAfter = async (i) => {
    let newIndex;

    if (i === questions.length - 1) {
      newIndex = i + 1;
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

  return questions.map((question, i) => (
    <Box key={i}>
      <Question
        formId={formId}
        question={question}
        setQuestions={setQuestions}
      />
      <Button onClick={() => addQuestionAfter(i)}>Add question</Button>
      {/* <Button onClick={() => deleteQuestion(i)}>Delete question</Button> */}
    </Box>
  ));
};

export default memo(QuestionsList);
