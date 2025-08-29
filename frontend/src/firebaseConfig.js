// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Your real config here
const firebaseConfig = {
  apiKey: "AIzaSyCn_JFoIExgSx_RxloVKtDaLJ9KK1obgwc",
  authDomain: "note-application-838c5.firebaseapp.com",
  projectId: "note-application-838c5",
  storageBucket: "note-application-838c5.appspot.com",
  messagingSenderId: "856652072769",
  appId: "1:856652072769:web:a0c48c5591af100b6d43c0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
