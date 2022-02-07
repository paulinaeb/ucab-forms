import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import { format } from "date-fns";
import {
  CHECKBOX,
  FILE,
  DATE,
  DATETIME,
  SLIDER,
  SORTABLE,
  RATING,
  TIME,
} from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import Slider from "../Slider";
import Rating from "../Rating";
import FilesResponse from "./FilesResponse";

const Response = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  return useMemo(() => {
    const renderItem = (item) => {
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
          <span>
            <PaginationItem {...item} />
          </span>
        </Tooltip>
      );
    };

    const renderValue = (value, question) => {
      if (question.type === CHECKBOX) {
        return (
          <FormGroup>
            {value.map((option, i) => (
              <FormControlLabel
                key={i}
                disabled
                checked
                control={<Checkbox />}
                label={<Typography>{option}</Typography>}
              />
            ))}
          </FormGroup>
        );
      }

      if (question.type === SORTABLE) {
        return (
          <Stack spacing={1}>
            {value.map((option, i) => (
              <Card key={i} sx={{ p: 2 }}>
                <Typography>{option}</Typography>
              </Card>
            ))}
          </Stack>
        );
      }

      if (question.type === SLIDER) {
        return <Slider disabled question={question} value={value} />;
      }

      if (question.type === RATING) {
        return <Rating readOnly value={value} />;
      }

      if (question.type === FILE) {
        return <FilesResponse files={value} />;
      }

      let text = value;

      if (question.type === DATE) {
        text = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME) {
        text = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME) {
        text = format(value.toDate(), "hh:mm a");
      }

      return <Typography>{text}</Typography>;
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
          <Typography align="right" variant="caption" color="text.secondary">
            Respondido el{" "}
            {format(responses[page - 1].submittedAt, "dd/MM/yyyy, hh:mm a")}
          </Typography>
          {questions.map((question) => (
            <Card key={question.id} sx={{ p: 3 }} variant="outlined">
              <Typography gutterBottom>{question.title}</Typography>
              {responses[page - 1].answers[question.id].value === "" ||
              responses[page - 1].answers[question.id].length === 0 ? (
                <Typography fontStyle="italic">Respuesta vacía</Typography>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Respuesta
                  </Typography>
                  <Box mt={1}>
                    {renderValue(
                      responses[page - 1].answers[question.id],
                      question
                    )}
                  </Box>
                </Box>
              )}
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [responses, page, questions]);
};

export default Response;
