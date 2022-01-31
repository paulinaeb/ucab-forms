import { useMemo, useState } from "react";
import {
  Box,
  Card,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import debounce from "lodash.debounce";
import { saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useForm } from "../hooks/useForm";
import Header from "../components/Header";
import EditFormHeader from "../components/EditForm/Header";
import DrawerLayout from "../components/EditForm/DrawerLayout";
import Tabs from "../components/EditForm/Tabs";

const EditForm = () => {
  const user = useUser();
  const { form, setForm, loading } = useForm();
  const [openDrawer, setOpenDrawer] = useState(false);

  const debouncedSave = useMemo(() => {
    return debounce(async (form) => {
      await saveForm(form);
    }, 3000);
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newForm = { ...form, [field]: value };

    debouncedSave(newForm);
    setForm(newForm);
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">No se encontró la encuesta</Typography>
        </Box>
      </Box>
    );
  }

  if (form.userId !== user.id) {
    return (
      <Box>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            No tienes permisos para editar esta encuesta
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <EditFormHeader setOpenDrawer={setOpenDrawer} />
      <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
        <Stack spacing={2}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                variant="standard"
                multiline
                label="Título"
                value={form.title}
                onChange={handleChange("title")}
              />
              <TextField
                variant="standard"
                multiline
                label="Descripción"
                value={form.description}
                onChange={handleChange("description")}
              />
            </Stack>
          </Card>
          <Tabs setOpenDrawer={setOpenDrawer} />
        </Stack>
      </DrawerLayout>
    </Box>
  );
};

export default EditForm;
