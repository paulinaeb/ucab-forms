import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const submitResponse = async (formId, response) => {
  try {
    const responsesRef = collection(db, "forms", formId, "responses");
    const responseRef = await addDoc(responsesRef, response);

    return { response: responseRef };
  } catch (error) {
    return { error: { message: "Error al guardar las respuestas" } };
  }
};

export const getResponses = (formId, callback) => {
  const responsesRef = collection(db, "forms", formId, "responses");

  return onSnapshot(responsesRef, (snapshot) => {
    const responses = snapshot.docs.map((doc) => {
      const response = doc.data();
      response.id = doc.id;
      return response;
    });

    callback(responses);
  });
};
