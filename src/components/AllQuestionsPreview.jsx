import { memo } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab";
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
import Select from "./Select";
import Slider from "./Slider";

const QuestionPreview = ({ question }) => {
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
        <RadioGroup>
          {question.options.map((option, i) => (
            <FormControlLabel
              key={i}
              disabled
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      );
    case CHECKBOX:
      return (
        <FormGroup>
          {question.options.map((option, i) => (
            <FormControlLabel
              key={i}
              disabled
              value={option}
              control={<Checkbox />}
              label={option}
            />
          ))}
        </FormGroup>
      );
    case SELECT:
      return (
        <Select variant="standard" displayEmpty defaultValue="">
          {question.options.map((option, i) => (
            <MenuItem disabled key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      );
    case SLIDER:
      return <Slider disabled question={question} />;
    case DATE:
      return (
        <DatePicker
          label="Día, mes, año"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    case TIME:
      return (
        <TimePicker
          label="Hora"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    case DATETIME:
      return (
        <DateTimePicker
          label="Fecha y hora"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    default:
      return null;
  }
};

export default memo(QuestionPreview);
