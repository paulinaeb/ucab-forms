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
import { uploadFiles } from "./storage";
import { FILE } from "../constants/questions";

export const submitResponse = async (form, response) => {
  try {
    response.submittedAt = new Date();

    await Promise.all(
      form.questions.map(async (question) => {
        if (question.type === FILE) {
          response.answers[question.id] = await uploadFiles(
            response.answers[question.id],
            `forms/${form.id}/questions/${question.id}`
          );
        }
      })
    );

    const responsesRef = collection(db, "forms", form.id, "responses");
    const responseRef = await addDoc(responsesRef, response);

    const formRef = doc(db, "forms", form.id);
    updateDoc(formRef, {
      responses: increment(1),
    });

    return { response: responseRef };
  } catch (error) {
    console.log(error);
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
