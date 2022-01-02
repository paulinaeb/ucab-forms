import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { saveQuestion } from "../api/forms";
import useAutoSave from "../hooks/useAutoSave";

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
    default:
      return null;
  }
};

export default QuestionPreview;
