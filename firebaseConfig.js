import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB7FXoyNvqWEHCWOJRaB2v6lx2bR_mMV4A",
  authDomain: "book-catalog-db.firebaseapp.com",
  projectId: "book-catalog-db",
  storageBucket: "book-catalog-db.appspot.com",
  messagingSenderId: "36154884267",
  appId: "1:36154884267:web:f634d86d134ac31f4037ee",
  measurementId: "G-VBHGLJPM1Y",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export default database;
