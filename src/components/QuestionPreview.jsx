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
    const handleChange = (field) => (e) => {
      const value = e.target.value;

      const newQuestion = { ...question, [field]: value };

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
            fullWidth
          />
        );
      case RADIO:
        return (
          <FormControl component="fieldset">
            <RadioGroup>
              {question.options.map((option, i) => (
                <Box key={i}>
                  <FormControlLabel
                    key={i}
                    disabled
                    value={option}
                    control={<Radio />}
                    label={
                      option
                      /*<TextField
                          variant="standard"
                          value={option}
                          onChange={handleChangeOption(i)}
                          sx={{width:300}}
                        />*/
                    }
                  />
                  {/* <Button onClick={() => deleteOption(i)}>
                    Eliminar opción
                  </Button> */}
                </Box>
              ))}
            </RadioGroup>
            {/* <Button onClick={addOption}>Agregar opción</Button> */}
          </FormControl>
        );
      case CHECKBOX:
        return (
          <FormControl component="fieldset">
            <FormGroup>
              {question.options.map((option, i) => (
                <Box key={i}>
                  <FormControlLabel
                    key={i}
                    disabled
                    value={option}
                    control={<Checkbox />}
                    label={
                      option
                      // <TextField
                      //   variant="standard"
                      //   value={option}
                      //   onChange={handleChangeOption(i)}
                      // />
                    }
                  />
                  {/* <Button onClick={() => deleteOption(i)}>
                      Eliminar opción
                    </Button> */}
                </Box>
              ))}
            </FormGroup>
            {/* <Button onClick={addOption}>Agregar opción</Button> */}
          </FormControl>
        );
      case SELECT:
        return (
          <TextField select variant="standard" defaultValue="_">
            <MenuItem disabled value="_">
              Selecciona una opción
            </MenuItem>
            {question.options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          // <Box>
          //   {question.options.map((option, i) => (
          //     <Box key={i}>
          //       <Typography>{i + 1}.</Typography>
          //       <TextField
          //         variant="standard"
          //         value={option}
          //         onChange={handleChangeOption(i)}
          //       />
          //       <Button onClick={() => deleteOption(i)}>Eliminar opción</Button>
          //     </Box>
          //   ))}
          //   <Button onClick={addOption}>Agregar opción</Button>
          // </Box>
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
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        );
      case TIME:
        return (
          <TimePicker
            label="Hora"
            disabled
            value={null}
            onChange={() => null}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        );
      case DATETIME:
        return (
          <DateTimePicker
            label="Fecha y hora"
            disabled
            value={null}
            onChange={() => null}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        );
      default:
        return null;
    }
  }, [debouncedSave, question, setQuestions]);
};

export default QuestionPreview;
