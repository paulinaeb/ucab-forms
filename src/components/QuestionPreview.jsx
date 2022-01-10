import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { saveQuestion } from "../api/forms";
import useAutoSave from "../hooks/useAutoSave";

const sliderMinValues = [0, 1];
const sliderMaxValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const QuestionPreview = ({ formId, question, setQuestions }) => {
  const autoSave = useAutoSave();

  const handleChangeOption = (i) => (e) => {
    const option = e.target.value;

    const options = [...question.options];
    options[i] = option;

    const newQuestion = { ...question, options };

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    const newQuestion = { ...question, [field]: value };

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const addOption = () => {
    const option = "Opción " + (question.options.length + 1);
    const newQuestion = { ...question, options: [...question.options, option] };

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const deleteOption = (i) => {
    const options = [...question.options];
    options.splice(i, 1);

    const newQuestion = { ...question, options };

    autoSave(async () => {
      await saveQuestion(formId, newQuestion);
      alert("Pregunta guardada");
    });

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

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
        <FormControl component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <RadioGroup>
            {question.options.map((option, i) => (
              <Box key={i}>
                <FormControlLabel
                  key={i}
                  disabled
                  value={option}
                  control={<Radio />}
                  label={
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  }
                />
                <Button onClick={() => deleteOption(i)}>Eliminar opción</Button>
              </Box>
            ))}
          </RadioGroup>
          <Button onClick={addOption}>Agregar opción</Button>
        </FormControl>
      );
    case "checkbox":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <FormGroup>
            {question.options.map((option, i) => (
              <Box key={i}>
                <FormControlLabel
                  key={i}
                  disabled
                  value={option}
                  control={<Checkbox />}
                  label={
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  }
                />
                <Button onClick={() => deleteOption(i)}>Eliminar opción</Button>
              </Box>
            ))}
          </FormGroup>
          <Button onClick={addOption}>Agregar opción</Button>
        </FormControl>
      );
    case "select":
      return (
        <Box>
          {question.options.map((option, i) => (
            <Box key={i}>
              <Typography>{i + 1}.</Typography>
              <TextField
                variant="standard"
                value={option}
                onChange={handleChangeOption(i)}
              />
              <Button onClick={() => deleteOption(i)}>Eliminar opción</Button>
            </Box>
          ))}
          <Button onClick={addOption}>Agregar opción</Button>
        </Box>
      );
    case "slider":
      return (
        <Box>
          <TextField
            select
            label="Desde"
            value={question.min}
            onChange={handleChange("min")}
          >
            {sliderMinValues.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Hasta"
            value={question.max}
            onChange={handleChange("max")}
          >
            {sliderMaxValues.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
          <Typography>{question.min}</Typography>
          <TextField
            variant="standard"
            value={question.minLabel ?? ""}
            onChange={handleChange("minLabel")}
          />
          <Typography>{question.max}</Typography>
          <TextField
            variant="standard"
            value={question.maxLabel ?? ""}
            onChange={handleChange("maxLabel")}
          />
        </Box>
      );
    default:
      return null;
  }
};

export default QuestionPreview;
