import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Pagination,
  PaginationItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import ResponsesSummary from "./ResponsesSummary";
import Response from "./Response";
import ResponseResponse from "./ResponseResponse";

const Responses = () => {
  const { responses } = useForm();
  const [view, setView] = useState("summary");

  return useMemo(() => {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={view}
            exclusive
            onChange={(event, value) => setView(value)}
          >
            <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="summary">
              <Typography>Resumen</Typography>
            </ToggleButton>
            <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="question">
              <Typography>Pregunta</Typography>
            </ToggleButton>
            <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="person">
              <Typography>Persona</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography fontSize="h6.fontSize">{`${responses.length} respuestas`}</Typography>
        </Box>
        {responses.length === 0 ? (
          <Typography>No hay respuestas</Typography>
        ) : (
          <>
            {view === "summary" && <ResponsesSummary />}
            {view === "question" && <ResponseResponse />}
            {view === "person" && <Response />}
          </>
        )}
      </Box>
    );
  }, [responses.length, view]);
};

export default Responses;
