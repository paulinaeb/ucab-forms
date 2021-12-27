import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const signUp = async ({ name, email, password }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
    });

    return { ok: true, message: "Usuario registrado exitosamente" };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};

export const logIn = async ({ email, password }) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return { ok: true, message: "Bienvenido de vuelta" };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);

    return { ok: true, message: "Sesión cerrada correctamente" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: error.message };
  }
};
