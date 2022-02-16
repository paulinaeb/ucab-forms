import { useMemo } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import QuestionStat from "./QuestionStat";

const ResponsesSummary = () => {
  const { questions, responses } = useForm();
  const answers = useMemo(() => responses.map((r) => r.answers), [responses]);

  return useMemo(() => {
    return (
      <Box>
        <Stack spacing={2}>
          {questions.map((question) => (
            <Card key={question.id} sx={{ p: 3 }} variant="outlined">
              <Typography>{question.title}</Typography>
              <QuestionStat question={question} responses={answers} />
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [answers, questions]);
};

export default ResponsesSummary;
