import { Box, Slider as MuiSlider, Typography } from "@mui/material";

const Slider = ({ question, ...props }) => {
  const sliderMarks = () => {
    const marks = [];

    for (let i = question.min; i <= question.max; i++) {
      marks.push({ value: i, label: i });
    }

    return marks;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography align="center" sx={{ mb: 2, maxWidth: "25%" }}>
        {question.minLabel}
      </Typography>
      <MuiSlider
        valueLabelDisplay="auto"
        marks={sliderMarks()}
        min={question.min}
        max={question.max}
        sx={{ mx: 2 }}
        {...props}
      />
      <Typography align="center" sx={{ mb: 2, maxWidth: "25%" }}>
        {question.maxLabel}
      </Typography>
    </Box>
  );
};

export default Slider;
