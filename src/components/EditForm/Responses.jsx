import { useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import QuestionSummary from "./QuestionSummary";

const Responses = () => {
  const { questions, responses } = useForm();

  return useMemo(() => {
    return (
      <Box>
        <Stack spacing={2}>
          {questions.map((question) => (
            <Box key={question.id}>
              <Typography variant="h6">{question.title}</Typography>
              <QuestionSummary question={question} responses={responses} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }, [questions, responses]);
};

export default Responses;
