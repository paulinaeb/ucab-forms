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

    return { ok: true };
  } catch (err) {
    let error;

    if (err.code === "auth/email-already-in-use") {
      error = "Ya existe un usuario con este email";
    } else {
      error = "Error desconocido";
    }

    return { ok: false, error };
  }
};

export const logIn = async ({ email, password }) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return { ok: true };
  } catch (err) {
    let error;

    switch (err.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        error = "Email o contraseña incorrectos";
        break;
      case "auth/too-many-requests":
        error = "Cuenta bloqueada temporalmente";
        break;
      default:
        error = "Error desconocido";
        break;
    }

    return { ok: false, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);

    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};
