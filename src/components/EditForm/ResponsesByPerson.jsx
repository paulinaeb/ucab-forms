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
import { format } from "date-fns";
import { useForm } from "../../hooks/useForm";

const Response = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  return useMemo(() => {
    const renderItem = (item) => {
      if (item.disabled) {
        return <PaginationItem {...item} />;
      }

      let title = "";

      if (item.type === "page") {
        title = format(
          responses[item.page - 1].submittedAt,
          "dd/MM/yyyy hh:mm a"
        );
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
            count={responses.length}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            shape="rounded"
            renderItem={renderItem}
          />
          {questions.map((question) => (
            <Card key={question.id} sx={{ p: 3 }} variant="outlined">
              <Typography>{question.title}</Typography>
              <Typography>
                {JSON.stringify(responses[page - 1][question.id])}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [responses, page, questions]);
};

export default Response;
