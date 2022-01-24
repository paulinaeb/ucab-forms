import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Container,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { form, setQuestions, current, setCurrent } = useForm();

  return useMemo(() => {
    const handleClick = () => {
      setCurrent(question.id);
      setOpenDrawer(true);
    };

    const requiredMark = question.required && (
      <Typography component="span" color="error">
        {" "}
        *
      </Typography>
    );

    return (
      <Card
        sx={{ p: 3 }}
        onClick={handleClick}
        elevation={question.id === current ? 5 : 0}
        variant={question.id === current ? "elevation" : "outlined"}
      >
        <Typography mb={2}>
          {question.title}
          {requiredMark}
        </Typography>
        {/* <Container
            sx={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Typography variant="h5" sx={{ width: 300, mt: 1 }}>
              Titulo de la pregunta
            </Typography>

            <Container sx={{ justifyContent: "flex-end", display: "flex" }}>
              <FormControlLabel
                control={<Checkbox />}
                checked={question.required}
                onChange={handleChangeRequired}
                label="Obligatoria"
              />

              <IconButton
                aria-label="eliminar pregunta"
                onClick={() => removeQuestion(question.id)}
              >
                <Delete />
              </IconButton>
            </Container>
          </Container> */}
        <AllQuestionsPreview question={question} />
      </Card>

      /*<Card>
        <TextField
          variant="filled"
          multiline
          placeholder="Título de la pregunta"
          value={question.title}
          onChange={handleChangeTitle}
        />

        <TextField
          variant="filled"
          select
          value={question.type}
          onChange={handleChangeType}
        >
          {questionTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <AllQuestionsPreview question={question} />
        <FormControlLabel
          control={<Checkbox />}
          checked={question.required}
          onChange={handleChangeRequired}
          label="Obligatoria"
        />
        <IconButton
          aria-label="eliminar pregunta"
          onClick={() => removeQuestion(question.id)}
        >
          <Delete />
        </IconButton>
      </Card>*/
    );
  }, [current, question, setOpenDrawer, setCurrent]);
};

export default EditQuestion;
