import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getQuestions } from "../api/questions";
import { getResponses } from "../api/responses";
import QuestionSummary from "../components/QuestionSummary";

const Responses = () => {
  const { id: formId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const unsubscribeQuestions = getQuestions(formId, (questions) => {
      setQuestions(questions);
    });

    const unsubscribeResponses = getResponses(formId, (responses) => {
      setResponses(responses);
    });

    return () => {
      unsubscribeQuestions();
      unsubscribeResponses();
    };
  }, [formId]);

  return (
    <>
      {questions.map((question) => (
        <Box key={question.id}>
          <Typography variant="h4">{question.title}</Typography>
          <QuestionSummary question={question} responses={responses} />
        </Box>
      ))}
    </>
  );
};

export default Responses;
