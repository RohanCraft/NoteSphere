// src/notesService.js
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const addNote = async (note) => {
  if (!auth.currentUser) return;
  return await addDoc(collection(db, "notes"), {
    ...note,
    userId: auth.currentUser.uid,
    createdAt: new Date(),
  });
};

export const getNotes = async () => {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, "notes"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc") // newest notes first
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateNote = async (id, updatedNote) => {
  const ref = doc(db, "notes", id);
  return await updateDoc(ref, updatedNote);
};

export const deleteNoteById = async (id) => {
  const ref = doc(db, "notes", id);
  return await deleteDoc(ref);
};
