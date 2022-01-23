import { useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
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
import { useForm } from "../hooks/useForm";

const Options = ({ question, debouncedSave }) => {
  const { setQuestions } = useForm();

  const handleChangeOption = (i) => (e) => {
    const option = e.target.value;

    const options = [...question.options];
    options[i] = option;

    const newQuestion = { ...question, options };

    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const addOption = () => {
    const option = "Opción " + (question.options.length + 1);
    const newQuestion = {
      ...question,
      options: [...question.options, option],
    };

    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  const deleteOption = (i) => () => {
    const options = [...question.options];
    options.splice(i, 1);

    const newQuestion = { ...question, options };

    debouncedSave(newQuestion);

    setQuestions((questions) =>
      questions.map((q) => (q.id === question.id ? newQuestion : q))
    );
  };

  switch (question.type) {
    case RADIO:
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <RadioGroup sx={{ mb: 1 }}>
            {question.options.map((option, i) => (
              <Box
                key={i}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  disabled
                  control={<Radio />}
                  value={option}
                  label={
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  }
                />
                <Tooltip title="Eliminar">
                  <IconButton onClick={deleteOption(i)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </RadioGroup>
          <Button size="small" onClick={addOption}>
            Agregar opción
          </Button>
        </FormControl>
      );
    case CHECKBOX:
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <FormGroup sx={{ mb: 1 }}>
            {question.options.map((option, i) => (
              <Box
                key={i}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  disabled
                  control={<Checkbox />}
                  value={option}
                  label={
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  }
                />
                <Tooltip title="Eliminar opción" arrow>
                  <IconButton onClick={deleteOption(i)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </FormGroup>
          <Button size="small" onClick={addOption}>
            Agregar opción
          </Button>
        </FormControl>
      );
    case SELECT:
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Opciones</FormLabel>
          <FormGroup sx={{ mb: 1 }}>
            {question.options.map((option, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography mr={2} color="text.secondary">
                    {i + 1}.
                  </Typography>
                  <TextField
                    variant="standard"
                    value={option}
                    onChange={handleChangeOption(i)}
                  />
                </Box>
                <Tooltip title="Eliminar opción" arrow>
                  <IconButton onClick={deleteOption(i)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </FormGroup>
          <Button size="small" onClick={addOption}>
            Agregar opción
          </Button>
        </FormControl>
      );
    default:
      return null;
  }
};

export default Options;
