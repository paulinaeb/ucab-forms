import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { Add, Edit, Delete } from "@mui/icons-material";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { createForm, deleteForm, getUserForms } from "../api/forms";
import { useUser } from "../hooks/useUser";

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

const Table = () => {
  const user = useUser();
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
    const { form, error } = await createForm(user.id);

    if (error) {
      return enqueueSnackbar(error, { variant: "error" });
    }

    navigate("/forms/edit/" + form.id);
  };

  return (
    <MaterialTable
      columns={columns}
      data={forms}
      title="Mis encuestas"
      isLoading={loading}
      options={{
        actionsColumnIndex: -1,
        pageSize: 10,
      }}
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
          onClick: (event, rowData) => {
            // TODO: Dialog
            deleteForm(rowData.id);
          },
        },
      ]}
      localization={{
        toolbar: {
          searchTooltip: "Buscar",
          searchPlaceholder: "Buscar",
        },
        header: {
          actions: "Acciones",
        },
        body: {
          emptyDataSourceMessage: "No hay encuestas que mostrar",
        },
        pagination: {
          labelRowsSelect: "Filas",
          firstTooltip: "Ir al principio",
          nextTooltip: "Siguiente página",
          previousTooltip: "Página anterior",
          lastTooltip: "Ir al final",
          labelDisplayedRows: "{from}-{to} de {count}",
          labelRowsPerPage: "",
        },
      }}
    />
  );
};

export default Table;
