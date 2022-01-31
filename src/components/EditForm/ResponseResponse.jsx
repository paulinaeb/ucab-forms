import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import { getResponseCountText } from "../../utils/stats";

const ResponseResponse = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  const question = questions[page - 1];

  const responsesWithStats = useMemo(() => {
    const responseCount = {};

    responses.forEach((response) => {
      const value = response[question.id];

      if (responseCount[value]) {
        responseCount[value]++;
      } else {
        responseCount[value] = 1;
      }
    });

    const sortedResponseCount = Object.entries(responseCount).sort(
      ([valueA, countA], [valueB, countB]) => countB - countA
    );

    return sortedResponseCount.map(([value, count]) => ({
      value,
      count,
    }));
  }, [question.id, responses]);

  return useMemo(() => {
    const renderItem = (item) => {
      if (item.disabled) {
        return <PaginationItem {...item} />;
      }

      let title = "";

      if (item.type === "page") {
        title = questions[item.page - 1].title;
      } else if (item.type === "previous") {
        title = "Anterior";
      } else if (item.type === "next") {
        title = "Siguiente";
      }

      return (
        <Tooltip title={title} arrow>
          <PaginationItem {...item} />
        </Tooltip>
      );
    };

    return (
      <Box>
        <Stack spacing={2}>
          <Pagination
            count={questions.length}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            shape="rounded"
            renderItem={renderItem}
          />
          <Card sx={{ p: 3 }} variant="outlined">
            <Typography fontSize="h6.fontSize">{question.title}</Typography>
          </Card>
          {responsesWithStats.map((response, i) => (
            <Card key={i} sx={{ p: 3 }} variant="outlined">
              <Typography>{response.value}</Typography>
              <Typography color="text.secondary" variant="caption">
                {getResponseCountText(response.count)}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [page, question.title, questions, responsesWithStats]);
};

export default ResponseResponse;
