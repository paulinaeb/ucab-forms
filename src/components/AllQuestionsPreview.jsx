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
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCut } from "@mui/icons-material";
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
import Select from "./Select";

const sliderMarks = (question) => {
  const marks = [];

  for (let i = question.min; i <= question.max; i++) {
    marks.push({ value: i, label: i });
  }

  return marks;
};

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
          <Select variant="standard" displayEmpty defaultValue="">
            {question.options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography align="center" sx={{ mb: 2, maxWidth: "25%" }}>
              {question.minLabel}
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              marks={sliderMarks(question)}
              min={question.min}
              max={question.max}
              sx={{ mx: 2 }}
            />
            <Typography align="center" sx={{ mb: 2, maxWidth: "25%" }}>
              {question.maxLabel}
            </Typography>
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
  }, [question]);
};

export default QuestionPreview;
