import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  FILE,
  RADIO,
  RATING,
  SELECT,
  SLIDER,
  SORTABLE,
  TEXT,
  TEXTAREA,
  TIME,
} from "../constants/questions";
import Select from "./Select";
import Slider from "./Slider";
import SortableList from "./SortableList";
import UploadButton from "./UploadButton";
import Rating from "./Rating";
import RequiredMark from "./RequiredMark";

const Question = ({ answers, question, setAnswers }) => {
  const [other, setOther] = useState("");

  const handleChange = (e) => {
    setAnswers({ ...answers, [question.id]: e.target.value });
  };

  const answer = answers[question.id] ?? "";

  const renderQuestion = () => {
    switch (question.type) {
      case TEXT:
        return (
          <TextField
            variant="standard"
            placeholder="Respuesta"
            required={question.required}
            value={answer}
            onChange={handleChange}
            type={question.specialType === "email" ? "email" : "text"}
            autoComplete={question.specialType}
          />
        );
      case TEXTAREA:
        return (
          <TextField
            variant="standard"
            placeholder="Respuesta"
            multiline
            fullWidth
            required={question.required}
            value={answer}
            onChange={handleChange}
          />
        );
      case RADIO:
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <RadioGroup value={answer} onChange={handleChange}>
              {question.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
              {question.other && (
                <FormControlLabel
                  value={other}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>Otros: </Typography>
                      <TextField
                        variant="standard"
                        value={other}
                        onChange={(e) => {
                          if (answer === other) {
                            setAnswers({
                              ...answers,
                              [question.id]: e.target.value,
                            });
                          }

                          setOther(e.target.value);
                        }}
                      />
                    </Box>
                  }
                />
              )}
            </RadioGroup>
            {!question.required && (
              <Button
                sx={{ alignSelf: "flex-end" }}
                onClick={() => setAnswers({ ...answers, [question.id]: "" })}
              >
                Borrar selección
              </Button>
            )}
          </Box>
        );
      case CHECKBOX:
        return (
          <FormGroup>
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
            {question.other && (
              <FormControlLabel
                value={other}
                control={<Checkbox />}
                checked={
                  !!answers[question.id] && answers[question.id].includes(other)
                }
                onChange={(e) => {
                  const newAnswers = { ...answers };
                  newAnswers[question.id] = newAnswers[question.id] || [];
                  if (e.target.checked) {
                    newAnswers[question.id] = [
                      ...newAnswers[question.id],
                      other,
                    ];
                  } else {
                    newAnswers[question.id] = newAnswers[question.id].filter(
                      (o) => o !== other
                    );
                  }
                  setAnswers(newAnswers);
                }}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Otros: </Typography>
                    <TextField
                      variant="standard"
                      value={other}
                      onChange={(e) => {
                        if (answers[question.id].includes(other)) {
                          setAnswers({
                            ...answers,
                            [question.id]: [
                              ...answers[question.id].filter(
                                (o) => o !== other
                              ),
                              e.target.value,
                            ],
                          });
                        }

                        setOther(e.target.value);
                      }}
                    />
                  </Box>
                }
              />
            )}
          </FormGroup>
        );
      case SELECT:
        return (
          <Select
            variant="standard"
            required={question.required}
            displayEmpty
            value={answer}
            onChange={handleChange}
          >
            <MenuItem sx={{ color: "text.secondary" }} value="">
              Seleccione una opción
            </MenuItem>
            <Divider />
            {question.options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      case SORTABLE:
        return (
          <SortableList
            items={answer}
            onChange={(newItems) =>
              setAnswers({ ...answers, [question.id]: newItems })
            }
          />
        );
      case SLIDER:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
            <Slider
              disabled={answers[question.id] === ""}
              question={question}
              value={answers[question.id] || question.min}
              onChange={(e, value) =>
                setAnswers({ ...answers, [question.id]: value })
              }
            />
            {!question.required &&
              (answers[question.id] === "" ? (
                <Button
                  sx={{ alignSelf: "flex-end" }}
                  onClick={() =>
                    setAnswers({ ...answers, [question.id]: question.min })
                  }
                >
                  Activar selección
                </Button>
              ) : (
                <Button
                  sx={{ alignSelf: "flex-end" }}
                  onClick={() => setAnswers({ ...answers, [question.id]: "" })}
                >
                  Borrar selección
                </Button>
              ))}
          </Box>
        );
      case RATING:
        return (
          <Rating
            value={answers[question.id]}
            onChange={(e, value) =>
              setAnswers({ ...answers, [question.id]: value || 0 })
            }
          />
        );
      case DATE:
        return (
          <DatePicker
            value={answers[question.id] || null}
            onChange={(value) =>
              setAnswers({ ...answers, [question.id]: value })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                required={question.required}
              />
            )}
            okText="Aceptar"
            cancelText="Cancelar"
            toolbarTitle="Seleccionar fecha"
          />
        );
      case TIME:
        return (
          <TimePicker
            value={answers[question.id] || null}
            onChange={(value) =>
              setAnswers({ ...answers, [question.id]: value })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                required={question.required}
              />
            )}
            okText="Aceptar"
            cancelText="Cancelar"
            toolbarTitle="Seleccionar hora"
          />
        );
      case DATETIME:
        return (
          <DateTimePicker
            value={answers[question.id] || null}
            onChange={(value) =>
              setAnswers({ ...answers, [question.id]: value })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                required={question.required}
              />
            )}
            okText="Aceptar"
            cancelText="Cancelar"
            toolbarTitle="Seleccionar fecha y hora"
          />
        );
      case FILE:
        return (
          <Box>
            <Box sx={{ mb: 2 }}>
              {answer.map((file, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography noWrap>{file.name}</Typography>
                  <Tooltip title="Eliminar" arrow>
                    <IconButton
                      onClick={() => {
                        const newAnswers = { ...answers };
                        newAnswers[question.id] = newAnswers[
                          question.id
                        ].filter((f, j) => j !== i);
                        setAnswers(newAnswers);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
            <UploadButton
              inputId={question.id}
              multiple={question.multipleFiles}
              onChange={(files) => {
                if (question.multipleFiles) {
                  return setAnswers({
                    ...answers,
                    [question.id]: [...answer, ...files],
                  });
                }

                setAnswers({ ...answers, [question.id]: [...files] });
              }}
            />
          </Box>
        );
      default:
        return <Typography>No se puede mostrar la pregunta</Typography>;
    }
  };

  return (
    <Box>
      <Typography mb={2}>
        {question.title}
        <RequiredMark question={question} />
      </Typography>
      <Typography mb={2}>{question.instruction}</Typography>
      {renderQuestion()}
    </Box>
  );
};

export default Question;
