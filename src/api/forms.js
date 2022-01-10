import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { defaultQuestion } from "../constants/questions";

const formsRef = collection(db, "forms");

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
