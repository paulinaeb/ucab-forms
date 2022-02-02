export const TEXT = "text";
export const TEXTAREA = "textarea";
export const RADIO = "radio";
export const CHECKBOX = "checkbox";
export const SELECT = "select";
export const SORTABLE = "sortable";
export const SLIDER = "slider";
export const RATING = "rating";
export const DATE = "date";
export const TIME = "time";
export const DATETIME = "datetime";

export const ratingLabels = [
  "Sin calificar",
  "Malo",
  "Deficiente",
  "Regular",
  "Bueno",
  "Excelente",
];

export const questionTypes = [
  {
    value: TEXT,
    label: "Respuesta breve",
  },
  {
    value: TEXTAREA,
    label: "Respuesta larga",
  },
  {
    value: RADIO,
    label: "Opción múltiple",
  },
  {
    value: CHECKBOX,
    label: "Casillas de verificación",
  },
  {
    value: SELECT,
    label: "Lista desplegable",
  },
  {
    value: SORTABLE,
    label: "Lista ordenada",
  },
  {
    value: SLIDER,
    label: "Escala lineal",
  },
  {
    value: RATING,
    label: "Escala de valoración",
  },
  {
    value: DATE,
    label: "Fecha",
  },
  {
    value: TIME,
    label: "Hora",
  },
  {
    value: DATETIME,
    label: "Fecha y hora",
  },
];

export const defaultQuestion = {
  title: "Pregunta sin título",
  type: TEXT,
  required: false,
  specialType: "",
};
