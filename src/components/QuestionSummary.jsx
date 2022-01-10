import { Box, Typography, Container } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  RADIO,
  SELECT,
  SLIDER,
  TEXT,
  TEXTAREA,
  TIME,
} from "../constants/questions";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuestionSummary = ({ question, responses }) => {
  const numberOfResponses = responses.filter((r) => r[question.id]).length;

  const numberOfResponsesText =
    numberOfResponses +
    (numberOfResponses === 1 ? " respuesta" : " respuestas");

  let data = {};

  if ([RADIO, SELECT].includes(question.type)) {
    data = {
      labels: question.options,
      datasets: [
        {
          label: "# of Responses",
          data: question.options.map(
            (option) =>
              responses.filter((r) => r[question.id] === option).length
          ),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  switch (question.type) {
    case TEXT:
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case RADIO:
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          <Container maxWidth="sm">
            <Pie data={data} />
          </Container>
        </>
      );
    case CHECKBOX:
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case TEXTAREA:
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case SELECT:
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    default:
      return null;
  }
};

export default QuestionSummary;
