const TEXT = "text";
const TEXTAREA = "textarea";
const RADIO = "radio";
const CHECKBOX = "checkbox";
const SELECT = "select";
const SLIDER = "slider";
const DATE = "date";
const TIME = "time";
const DATETIME = "datetime";

const questionTypes = [
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
    value: SLIDER,
    label: "Escala lineal",
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

const defaultQuestion = {
  title: "Pregunta sin título",
  type: TEXT,
  required: false,
};

export {
  defaultQuestion,
  questionTypes,
  TEXT,
  TEXTAREA,
  RADIO,
  CHECKBOX,
  SELECT,
  SLIDER,
  DATE,
  TIME,
  DATETIME,
};
