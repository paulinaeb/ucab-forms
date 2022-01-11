import { Box, Typography, Container } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
          label: "Respuestas",
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

  if (question.type === CHECKBOX) {
    data = {
      labels: question.options,
      datasets: [
        {
          label: "Respuestas",
          data: question.options.map(
            (option) =>
              responses.filter((r) => r[question.id].includes(option)).length
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
        },
      ],
    };
  }

  if (question.type === SLIDER) {
    const labels = [];

    for (let i = question.min; i <= question.max; i++) {
      labels.push(i);
    }

    data = {
      labels,
      datasets: [
        {
          label: "Respuestas",
          data: labels.map(
            (n) => responses.filter((r) => r[question.id] === n).length
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
        },
      ],
    };
  }

  switch (question.type) {
    case TEXT:
    case TEXTAREA:
    case DATE:
    case TIME:
    case DATETIME:
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          {responses.map((r) => (
            <Typography key={r.id} variant="body2">
              {JSON.stringify(r[question.id])}
            </Typography>
          ))}
        </>
      );
    case RADIO:
    case SELECT:
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          <Container maxWidth="sm">
            <Pie data={data} />
          </Container>
        </>
      );
    case CHECKBOX:
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          <Container maxWidth="sm">
            <Bar
              data={data}
              options={{
                indexAxis: "y",
                elements: {
                  bar: {
                    borderWidth: 1,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: question.title,
                  },
                },
              }}
            />
          </Container>
        </>
      );
    case SLIDER:
      return (
        <>
          <Typography variant="body1">{numberOfResponsesText}</Typography>
          <Container maxWidth="sm">
            <Bar
              data={data}
              options={{
                elements: {
                  bar: {
                    borderWidth: 1,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: question.title,
                  },
                },
              }}
            />
          </Container>
        </>
      );
    default:
      return null;
  }
};

export default QuestionSummary;
