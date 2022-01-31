const getResponseCountText = (count) => {
  if (count === 1) {
    return "1 respuesta";
  }

  return `${count} respuestas`;
};

export { getResponseCountText };
