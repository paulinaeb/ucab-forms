import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAKhHXAZxgBo5fzjyHAAZFV0My6FdAS1o",
  authDomain: "bd-ucab-forms.firebaseapp.com",
  projectId: "bd-ucab-forms",
  storageBucket: "bd-ucab-forms.appspot.com",
  messagingSenderId: "294291653199",
  appId: "1:294291653199:web:56d4d237626ba2b551e03a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
enableMultiTabIndexedDbPersistence(db);

export { auth, db, storage };
