import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "qubit-ai-f2530.firebaseapp.com",
  projectId: "qubit-ai-f2530",
  storageBucket: "qubit-ai-f2530.appspot.com",
  messagingSenderId: "771623874526",
  appId: "1:771623874526:web:e31ce311f0524e15cd774f",
  measurementId: "G-SXM3Z4098G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, logOut };
