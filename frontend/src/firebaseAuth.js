// src/firebaseAuth.js
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Register + save name in Firestore
export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store name + email in Firestore under users collection
    await setDoc(doc(db, "users", user.uid), {
      name: name || "",
      email,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // pass it back to UI for toast
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
};

// Auth state listener
export const authStateListener = (callback) =>
  onAuthStateChanged(auth, callback);
