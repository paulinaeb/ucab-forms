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
export const FILE = "file";
export const IMAGE = "image";

export const compatibility = {
  [TEXT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [TEXTAREA]: [TEXT, TEXTAREA, RADIO, SELECT],
  [RADIO]: [TEXT, TEXTAREA, RADIO, SELECT],
  [CHECKBOX]: [CHECKBOX],
  [SELECT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [SORTABLE]: [SORTABLE],
  [SLIDER]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING],
  [RATING]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING],
  [DATE]: [DATE, TIME, DATETIME],
  [TIME]: [DATE, TIME, DATETIME],
  [DATETIME]: [DATE, TIME, DATETIME],
  [FILE]: [FILE],
  [IMAGE]: [FILE, IMAGE],
};

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
  {
    value: FILE,
    label: "Carga de archivo",
  },
  {
    value: IMAGE,
    label: "Carga de imagen",
  },
];

export const defaultQuestion = {
  title: "Pregunta sin título",
  type: TEXT,
  required: false,
  specialType: "",
};
