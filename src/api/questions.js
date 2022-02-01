import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getQuestionsOnce = async (formId) => {
  const questionsRef = collection(db, "forms", formId, "questions");

  const q = query(questionsRef, orderBy("index"));

  const snapshot = await getDocs(q);

  const questions = snapshot.docs.map((doc) => {
    const question = doc.data();
    question.id = doc.id;

    return question;
  });

  return questions;
};

export const getQuestions = (formId, callback) => {
  const questionsRef = collection(db, "forms", formId, "questions");

  const q = query(questionsRef, orderBy("index"));

  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map((doc) => {
      const question = doc.data();
      question.id = doc.id;
      return question;
    });

    callback(questions);
  });
};

export const getQuestionsChanges = (formId, callback) => {
  const questionsRef = collection(db, "forms", formId, "questions");

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

    const formRef = doc(db, "forms", formId);
    updateDoc(formRef, {
      questions: increment(1),
    });

    return { question: questionRef };
  } catch (error) {
    return { error: { message: "Error al insertar la pregunta" } };
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
    deleteDoc(questionRef);

    const formRef = doc(db, "forms", formId);
    updateDoc(formRef, {
      questions: increment(-1),
    });

    return { question: questionRef };
  } catch (error) {
    return { error: { message: "Error al eliminar la pregunta" } };
  }
};
