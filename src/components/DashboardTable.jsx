import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { createForm, deleteForm, getUserForms } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useAlert } from "../hooks/useAlert";
import Table from "./Table";

const columns = [
  {
    title: "Título",
    field: "title",
  },
  {
    title: "Fecha de creación",
    field: "createdAt",
    type: "datetime",
    render: (rowData) => format(rowData.createdAt, "dd/MM/yyyy hh:mm a"),
  },
  {
    title: "Preguntas",
    field: "questions",
    type: "numeric",
    align: "center",
  },
  {
    title: "Respuestas",
    field: "responses",
    type: "numeric",
    align: "center",
  },
];

const DashboardTable = () => {
  const user = useUser();
  const openAlert = useAlert();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    return getUserForms(user.id, (forms) => {
      setForms(forms);
      setLoading(false);
    });
  }, [user.id]);

  const createNewForm = async () => {
    const { form, error } = await createForm(user);

    if (error) {
      return enqueueSnackbar(error, { variant: "error" });
    }

    navigate("/forms/edit/" + form.id);
  };

  const handleDelete = (event, rowData) => {
    openAlert({
      title: "Eliminar encuesta",
      message: "¿Estás seguro de eliminar esta encuesta?",
      action: async () => {
        const { error } = await deleteForm(rowData.id);

        if (error) {
          return enqueueSnackbar("Error al eliminar la encuesta ", {
            variant: "error",
          });
        }

        enqueueSnackbar("Encuesta eliminada", {
          variant: "success",
        });
      },
    });
  };

  return (
    <Table
      columns={columns}
      data={forms}
      title="Mis encuestas"
      isLoading={loading}
      actions={[
        {
          icon: () => <Add />,
          tooltip: "Crear",
          isFreeAction: true,
          onClick: createNewForm,
        },
        {
          icon: () => <Edit />,
          tooltip: "Editar",
          onClick: (event, rowData) => {
            navigate("/forms/edit/" + rowData.id);
          },
        },
        {
          icon: () => <Delete />,
          tooltip: "Eliminar",
          onClick: handleDelete,
        },
      ]}
      localization={{
        body: {
          emptyDataSourceMessage: "No hay encuestas que mostrar",
        },
      }}
    />
  );
};

export default DashboardTable;
