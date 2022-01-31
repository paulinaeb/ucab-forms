import { useMemo } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import QuestionStat from "./QuestionStat";

const ResponsesSummary = () => {
  const { questions, responses } = useForm();

  return useMemo(() => {
    return (
      <Box>
        <Stack spacing={2}>
          {questions.map((question) => (
            <Card key={question.id} sx={{ p: 3 }} variant="outlined">
              <Typography>{question.title}</Typography>
              <QuestionStat question={question} responses={responses} />
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [questions, responses]);
};

export default ResponsesSummary;
