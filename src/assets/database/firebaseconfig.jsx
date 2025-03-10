
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1fEdVB6okjeG0eUpW9RMK47nlf1J7DGY",
  authDomain: "practicainicial-11112.firebaseapp.com",
  projectId: "practicainicial-11112",
  storageBucket: "practicainicial-11112.firebasestorage.app",
  messagingSenderId: "664730027101",
  appId: "1:664730027101:web:eb0f61862c316bd11439b4"
};

// Initialize Firebase

const appfirebase = initializeApp(firebaseConfig);
const auth = getAuth(appfirebase);
const db = getFirestore(appfirebase);

export { appfirebase, auth, db };