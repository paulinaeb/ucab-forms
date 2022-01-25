import { useMemo } from "react";
import { Card, Typography } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { current, setCurrent } = useForm();

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
        <AllQuestionsPreview question={question} />
      </Card>
    );
  }, [current, question, setOpenDrawer, setCurrent]);
};

export default EditQuestion;
