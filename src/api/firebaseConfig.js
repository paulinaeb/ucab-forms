import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8QEkSwKQje02leX_Mh9dEZZduLLQEqw0",
  authDomain: "ucab-forms.firebaseapp.com",
  projectId: "ucab-forms",
  storageBucket: "ucab-forms.appspot.com",
  messagingSenderId: "674123606931",
  appId: "1:674123606931:web:7e3a2ccea12cd5cfe41666",
  measurementId: "G-8CGMPLSZWE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });

enableMultiTabIndexedDbPersistence(db);

export { auth, db };
