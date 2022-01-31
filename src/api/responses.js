import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const submitResponse = async (formId, response) => {
  try {
    const responsesRef = collection(db, "forms", formId, "responses");
    const responseRef = await addDoc(responsesRef, {
      ...response,
      submittedAt: new Date(),
    });

    const formRef = doc(db, "forms", formId);
    updateDoc(formRef, {
      responses: increment(1),
    });

    return { response: responseRef };
  } catch (error) {
    return { error: { message: "Error al guardar las respuestas" } };
  }
};

export const getResponses = (formId, callback) => {
  const responsesRef = collection(db, "forms", formId, "responses");

  const q = query(responsesRef, orderBy("submittedAt"));

  return onSnapshot(q, (snapshot) => {
    const responses = snapshot.docs.map((doc) => {
      const response = doc.data();
      response.id = doc.id;
      response.submittedAt = response.submittedAt.toDate();
      return response;
    });

    callback(responses);
  });
};
