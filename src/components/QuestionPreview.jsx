import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const QuestionPreview = ({ question, setQuestions }) => {
  switch (question.type) {
    case "text":
      return (
        <TextField
          disabled
          variant="standard"
          value="Texto de respuesta breve"
        />
      );
    case "textarea":
      return (
        <TextField
          disabled
          variant="standard"
          value="Texto de respuesta larga"
        />
      );
    case "radio":
      return (
        <FormControl disabled component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <RadioGroup>
            {question.options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    default:
      return null;
  }
};

export default QuestionPreview;
