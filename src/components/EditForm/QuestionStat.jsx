import { Box, Typography, Container } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { format } from "date-fns";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  RADIO,
  RATING,
  SELECT,
  SLIDER,
  TEXT,
  TEXTAREA,
  TIME,
  ratingLabels,
} from "../../constants/questions";
import { getResponseCountText } from "../../utils/stats";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

// TODO: Change responses to answers or viceversa
const QuestionStat = ({ question, responses }) => {
  // TODO: Memoize
  const responseCount = responses.filter((r) => r[question.id]).length;

  const responseCountText = getResponseCountText(responseCount);

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
              responses.filter((r) => r[question.id]?.includes(option)).length
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

  if (question.type === RATING) {
    const values = [1, 2, 3, 4, 5];

    data = {
      labels: ratingLabels.slice(1),
      datasets: [
        {
          label: "Respuestas",
          data: values.map(
            (v) => responses.filter((r) => r[question.id] === v).length
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
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]}
            </Typography>
          ))}
        </>
      );
    case DATE:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]
                ? format(r[question.id].toDate(), "dd/MM/yyyy")
                : ""}
            </Typography>
          ))}
        </>
      );
    case TIME:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id] ? format(r[question.id].toDate(), "hh:mm a") : ""}
            </Typography>
          ))}
        </>
      );
    case DATETIME:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
          {responses.map((r, i) => (
            <Typography key={i} variant="body2">
              {r[question.id]
                ? format(r[question.id].toDate(), "dd/MM/yyyy hh:mm a")
                : ""}
            </Typography>
          ))}
        </>
      );
    case RADIO:
    case SELECT:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
          <Container maxWidth="sm">
            <Pie data={data} />
          </Container>
        </>
      );
    case CHECKBOX:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
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
                },
              }}
            />
          </Container>
        </>
      );
    case SLIDER:
    case RATING:
      return (
        <>
          <Typography color="text.secondary" variant="caption">
            {responseCountText}
          </Typography>
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

export default QuestionStat;
