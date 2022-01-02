import {
  Box,
  Typography,
  TextField,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
} from "@mui/material";

const Question = ({ question, answers, setAnswers }) => {
  console.log(answers);

  const renderQuestion = () => {
    switch (question.type) {
      case "text":
        return (
          <TextField
            label={question.title}
            required={question.required}
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: e.target.value })
            }
          />
        );
      case "textarea":
        return (
          <TextField
            label={question.title}
            multiline
            required={question.required}
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: e.target.value })
            }
          />
        );
      case "radio":
        return (
          <FormControl>
            <FormLabel>{question.title}</FormLabel>
            {question.options.map((option, i) => (
              <FormControlLabel
                key={i}
                control={<Radio />}
                label={option}
                checked={answers[question.id] === option}
                onChange={(e) =>
                  setAnswers({ ...answers, [question.id]: option })
                }
              />
            ))}
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControl>
            <FormLabel>{question.title}</FormLabel>
            {question.options.map((option, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox />}
                label={option}
                checked={
                  !!answers[question.id] &&
                  answers[question.id].includes(option)
                }
                onChange={(e) => {
                  const newAnswers = { ...answers };
                  newAnswers[question.id] = newAnswers[question.id] || [];
                  if (e.target.checked) {
                    newAnswers[question.id] = [
                      ...newAnswers[question.id],
                      option,
                    ];
                  } else {
                    newAnswers[question.id] = newAnswers[question.id].filter(
                      (o) => o !== option
                    );
                  }
                  setAnswers(newAnswers);
                }}
              />
            ))}
          </FormControl>
        );
      case "select":
        return (
          <TextField
            select
            label={question.title}
            required={question.required}
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: e.target.value })
            }
          >
            {question.options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      default:
        return <Typography>No se puede mostrar la pregunta</Typography>;
    }
  };

  return (
    <Box>
      <Typography variant="h4">{question.title}</Typography>
      {renderQuestion()}
    </Box>
  );
};

export default Question;
