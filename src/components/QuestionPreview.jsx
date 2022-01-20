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
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab";
import debounce from "lodash.debounce";
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
import { saveQuestion } from "../api/questions";
import { useForm } from "../hooks/useForm";

const sliderMinValues = [0, 1];
const sliderMaxValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const QuestionPreview = ({ question }) => {
  const { form, setQuestions } = useForm();

  const debouncedSave = useMemo(
    () =>
      debounce(async (newQuestion) => {
        await saveQuestion(form.id, newQuestion);
        alert("Pregunta guardada");
      }, 3000),
    [form.id]
  );

  return useMemo(() => {
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

    const handleChange = (field) => (e) => {
      const value = e.target.value;

      const newQuestion = { ...question, [field]: value };

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

    const deleteOption = (i) => {
      const options = [...question.options];
      options.splice(i, 1);

      const newQuestion = { ...question, options };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    switch (question.type) {
      case TEXT:
        return (
          <TextField
            disabled
            variant="standard"
            value="Texto de respuesta breve"
          />
        );
      case TEXTAREA:
        return (
          <TextField
            disabled
            variant="standard"
            value="Texto de respuesta larga"
          />
        );
      case RADIO:
        return (
          <Container
            sx={{ justifyContent: "left-flex", display: "flex" }}
            maxWidth="lg"
          >
            <FormControl component="fieldset">
              <FormLabel component="legend">Opciones</FormLabel>
              <RadioGroup>
                {question.options.map((option, i) => (
                  <Box key={i} sx={{ width: 900 }}>
                    <FormControlLabel
                      key={i}
                      disabled
                      value={option}
                      control={<Radio />}
                      label={
                        /*<TextField
                          variant="standard"
                          value={option}
                          onChange={handleChangeOption(i)}
                          sx={{width:300}}
                        />*/
                        <Typography sx={{ mr: 15 }} variant="body1">
                          holaaaaa
                        </Typography>
                      }
                    />
                    <Button onClick={() => deleteOption(i)}>
                      Eliminar opción
                    </Button>
                  </Box>
                ))}
              </RadioGroup>
              <Button onClick={addOption} sx={{ width: 170, mt: 1, mb: 1 }}>
                Agregar opción
              </Button>
            </FormControl>
          </Container>
        );
      case CHECKBOX:
        return (
          <Box
            sx={{
              p: 3,
              top: 15,
              right: "20%",
            }}
          >
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
                    <Button onClick={() => deleteOption(i)}>
                      Eliminar opción
                    </Button>
                  </Box>
                ))}
              </FormGroup>
              <Button onClick={addOption}>Agregar opción</Button>
            </FormControl>
          </Box>
        );
      case SELECT:
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
      case SLIDER:
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
      case DATE:
        return (
          <DatePicker
            label="Día, mes, año"
            disabled
            value={null}
            onChange={() => null}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      case TIME:
        return (
          <TimePicker
            label="Hora"
            disabled
            value={null}
            onChange={() => null}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      case DATETIME:
        return (
          <DateTimePicker
            label="Fecha y hora"
            disabled
            value={null}
            onChange={() => null}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      default:
        return null;
    }
  }, [debouncedSave, question, setQuestions]);
};

export default QuestionPreview;
