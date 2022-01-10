import { Box, Typography, Container } from "@mui/material";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuestionSummary = ({ question, responses }) => {
  const numberOfResponses = responses.filter((r) => r[question.id]).length;

  const numberOfResponsesText =
    numberOfResponses +
    (numberOfResponses === 1 ? " respuesta" : " respuestas");

  let data = {};

  if (["radio", "select"].includes(question.type)) {
    data = {
      labels: question.options,
      datasets: [
        {
          label: "# of Votes",
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

  // if (question.type === "checkbox") {
  //   question.options.forEach((option) => {
  //     data[option] = responses.filter((r) =>
  //       r[question.id].includes(option)
  //     ).length;
  //   });
  // }

  switch (question.type) {
    case "text":
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case "radio":
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          <Container maxWidth="sm">
            <Pie data={data} />
          </Container>
        </>
      );
    case "checkbox":
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case "textarea":
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    case "select":
      return <Typography variant="body1">{numberOfResponsesText}</Typography>;
    default:
      return null;
  }
};

export default QuestionSummary;
