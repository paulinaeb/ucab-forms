import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import {
  Add as AddIcon,
  ContentCopy,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  createForm,
  deleteForm,
  duplicateForm,
  getUserForms,
  getCollaborationForms,
} from "../api/forms";
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
    title: "Autor",
    field: "author.name",
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
  const [userForms, setUserForms] = useState([]);
  const [collaborationForms, setCollaborationForms] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loadingUserForms, setLoadingUserForms] = useState(true);
  const [loadingCollaborationForms, setLoadingCollaborationForms] =
    useState(true);
  const [duplicating, setDuplicating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribeUserForms = getUserForms(user.id, (forms) => {
      setUserForms(forms);
      setLoadingUserForms(false);
    });

    const unsubscribeCollaborationForms = getCollaborationForms(
      user,
      (forms) => {
        setCollaborationForms(forms);
        setLoadingCollaborationForms(false);
      }
    );

    return () => {
      unsubscribeUserForms();
      unsubscribeCollaborationForms();
    };
  }, [user]);

  const forms = useMemo(() => {
    return [...userForms, ...collaborationForms].sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, [userForms, collaborationForms]);

  const createNewForm = async () => {
    setCreating(true);
    const { form, error } = await createForm(user);

    if (error) {
      setCreating(false);
      return enqueueSnackbar(error, { variant: "error" });
    }

    navigate("/forms/edit/" + form.id);
  };

  const handleDuplicate = async (event, rowData) => {
    setDuplicating(true);
    const { tableData, ...form } = rowData;
    const { error, newForm } = await duplicateForm(form, user);

    if (error) {
      setDuplicating(false);
      return enqueueSnackbar("Error al duplicar la encuesta", {
        variant: "error",
      });
    }

    enqueueSnackbar("Encuesta duplicada", { variant: "success" });
    navigate(`/forms/edit/${newForm.id}`);
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
      isLoading={
        loadingUserForms || loadingCollaborationForms || creating || duplicating
      }
      actions={[
        {
          icon: () => <AddIcon />,
          tooltip: "Crear",
          isFreeAction: true,
          onClick: createNewForm,
        },
        {
          icon: () => <EditIcon />,
          tooltip: "Editar",
          onClick: (event, rowData) => {
            navigate("/forms/edit/" + rowData.id);
          },
        },
        {
          icon: () => <ContentCopy />,
          tooltip: "Duplicar",
          onClick: handleDuplicate,
        },
        {
          icon: () => <DeleteIcon />,
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
