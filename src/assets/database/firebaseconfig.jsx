import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsvhPa3B8EbrWC6MkJdFJ1kxh-nAlQdLs",
  authDomain: "graficos-fed6b.firebaseapp.com",
  projectId: "graficos-fed6b",
  storageBucket: "graficos-fed6b.appspot.com",
  messagingSenderId: "154951536645",
  appId: "1:154951536645:web:c26314fc1d694a13148c6c"
};

// Initialize Firebase

const appfirebase = initializeApp(firebaseConfig);
const auth = getAuth(appfirebase);
let db;
try {
  db = initializeFirestore(appfirebase, {
    localCache: persistentLocalCache({
      cacheSizeBytes: 100 * 1024 * 1024, // 100 MB (opcional, para limitar tamaño)
    }),
  });
  console.log("Firestore inicializado con persistencia offline.");
} catch (error) {
  console.error("Error al inicializar Firestore con persistencia:", error);
  // Fallback: inicializar sin persistencia si falla
  db = initializeFirestore(appfirebase, {});
}

const storage = getStorage(appfirebase);

export { appfirebase, auth, db, storage };