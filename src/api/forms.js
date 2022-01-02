import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const formsRef = collection(db, "forms");

export const defaultQuestion = {
  title: "Pregunta sin título",
  type: "text",
};

export const createForm = async (userId) => {
  try {
    const formRef = await addDoc(formsRef, {
      userId,
      title: "Encuesta sin título",
      description: "",
    });

    const questionsRef = collection(db, "forms", formRef.id, "questions");
    await addDoc(questionsRef, { ...defaultQuestion, index: 0 });

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al crear la encuesta" } };
  }
};

export const getUserForms = (userId, callback) => {
  const q = query(formsRef, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      return form;
    });

    callback(forms);
  });
};

export const getForm = (id, callback) => {
  const formRef = doc(db, "forms", id);

  return onSnapshot(formRef, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const form = doc.data();
    form.id = doc.id;
    callback(form);
  });
};

export const getQuestions = (id, callback) => {
  const questionsRef = collection(db, "forms", id, "questions");

  const q = query(questionsRef, orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const changes = snapshot.docChanges().map((change) => ({
      type: change.type,
      oldIndex: change.oldIndex,
      newIndex: change.newIndex,
      question: { ...change.doc.data(), id: change.doc.id },
    }));

    callback(changes);
  });
};

export const insertQuestion = async (formId, question) => {
  try {
    const questionsRef = collection(db, "forms", formId, "questions");

    const questionRef = await addDoc(questionsRef, question);

    return { question: questionRef };
  } catch (error) {
    return { error: { message: "Error al insertar la pregunta" } };
  }
};

export const saveForm = async (form) => {
  try {
    const { id: formId, ...formData } = form;
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, formData);

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al guardar la encuesta" } };
  }
};

export const saveQuestion = async (formId, question) => {
  try {
    const { id: questionId, ...questionData } = question;
    const questionRef = doc(db, "forms", formId, "questions", questionId);
    await updateDoc(questionRef, questionData);

    return { question: questionRef };
  } catch (error) {
    return { error: { message: "Error al guardar la pregunta" } };
  }
};

export const deleteQuestion = async (formId, questionId) => {
  try {
    const questionRef = doc(db, "forms", formId, "questions", questionId);
    await deleteDoc(questionRef);

    return { question: questionRef };
  } catch (error) {
    return { error: { message: "Error al eliminar la pregunta" } };
  }
};

// export const saveAll = async (form, questions) => {
//   try {
//     const { id: formId, ...formData } = form;
//     const formRef = doc(db, "forms", formId);
//     await updateDoc(formRef, formData);

//     await Promise.all(
//       questions.map((question) => {
//         const { id: questionId, ...questionData } = question;
//         const questionRef = doc(db, "forms", formId, "questions", questionId);
//         return updateDoc(questionRef, questionData);
//       })
//     );

//     return true;
//   } catch (error) {
//     return false;
//   }
// };
