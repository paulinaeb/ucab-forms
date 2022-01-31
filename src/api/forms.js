import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { defaultQuestion } from "../constants/questions";
import { insertQuestion } from "./questions";

const formsRef = collection(db, "forms");

export const createForm = async (userId) => {
  try {
    const formRef = await addDoc(formsRef, {
      userId,
      title: "Encuesta sin título",
      description: "",
      createdAt: new Date(),
      questions: 0,
      responses: 0,
      settings: {
        allowAnswers: true,
      },
    });

    insertQuestion(formRef.id, { ...defaultQuestion, index: 0 });

    return { form: formRef };
  } catch (error) {
    return { error: "Error al crear la encuesta" };
  }
};

export const getUserForms = (userId, callback) => {
  const q = query(formsRef, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
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

export const deleteForm = async (formId) => {
  try {
    const formRef = doc(db, "forms", formId);
    await deleteDoc(formRef);

    return { form: formRef };
  } catch (error) {
    return { error: { message: "Error al eliminar la encuesta" } };
  }
};
