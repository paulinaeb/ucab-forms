export const calculateNewIndex = (questions, questionId) => {
  const i = questions.findIndex((q) => q.id === questionId);
  let newIndex;

  if (questions.length === 0) {
    newIndex = 0;
  } else if (i === questions.length - 1 || i === -1) {
    newIndex = questions[questions.length - 1].index + 1;
  } else {
    newIndex = (questions[i].index + questions[i + 1].index) / 2;
  }

  return newIndex;
};
