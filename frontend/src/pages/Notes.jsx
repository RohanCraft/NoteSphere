import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

import { authStateListener, logoutUser } from "../firebaseAuth";
import { addNote, getNotes, updateNote, deleteNoteById } from "../notesService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Notes = () => {
  const titleRef = useRef();
  const contentRef = useRef();

  const [showAddNote, setShowAddNote] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          setUserName(
            userDoc.exists() ? userDoc.data().name : currentUser.email
          );
        } catch {
          setUserName(currentUser.email);
        }
        await loadNotes();
      } else {
        setUser(null);
        setUserName("");
        setNotes([]);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes.");
    }
  };

  const handleAddNote = async () => {
    const title = (titleRef.current?.value || "").trim();
    const content = (contentRef.current?.value || "").trim();

    if (!title || !content) {
      toast.error("Please enter a title and content!");
      return;
    }

    try {
      await addNote({ title, content });
      if (titleRef.current) titleRef.current.value = "";
      if (contentRef.current) contentRef.current.value = "";
      setShowAddNote(false);
      toast.success("Note added successfully!");
      await loadNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add note.");
    }
  };

  const openEditNoteModal = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditNote(true);
  };

  const handleEditNote = async () => {
    if (!editId) return;
    const t = editTitle.trim();
    const c = editContent.trim();
    if (!t || !c) {
      toast.error("Please enter a title and content!");
      return;
    }
    try {
      await updateNote(editId, { title: t, content: c, editedAt: new Date() });
      toast.success("Note updated successfully!");
      setEditNote(false);
      setEditId(null);
      await loadNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note.");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteById(id);
      toast.success("Note deleted successfully!");
      await loadNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note.");
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredNotes([]);
      return;
    }
    const q = query.toLowerCase();
    setFilteredNotes(
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated Floating Shapes */}
      <div className="absolute -z-10 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-30 animate-pulse-slow blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400 rounded-full opacity-20 animate-pulse-slow blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-purple-400 rounded-full opacity-25 animate-pulse-slow blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-blue-900 text-white px-6 py-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex justify-between items-center w-full sm:w-auto">
            <h1 className="text-xl font-semibold">NoteSphere</h1>

            {/* Mobile user */}
            <div className="flex items-center gap-3 sm:hidden">
              <span className="text-sm text-gray-200">
                Hello,{" "}
                <span className="font-medium">{userName || "Guest"}</span>
              </span>
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm shadow-sm transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-3 sm:mt-0 flex justify-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full sm:w-72 px-4 py-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Desktop user */}
          <div className="hidden sm:flex items-center gap-4 justify-end">
            <span className="text-sm text-gray-200">
              Hello, <span className="font-medium">{userName || "Guest"}</span>
            </span>
            <button
              onClick={logoutUser}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm shadow-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Notes Grid */}
      <div className="p-6">
        {notes.length === 0 && filteredNotes.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <span className="text-4xl mb-2">📝</span>
            <p className="text-lg font-medium">No notes yet</p>
            <p className="text-sm">Click the + button to add your first note</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredNotes.length > 0 ? filteredNotes : notes).map((note) => (
              <div
                key={note.id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <h2 className="text-lg font-semibold mb-2 break-words">
                  {note.title}
                </h2>
                <p className="text-gray-700 mb-4 break-words whitespace-pre-line text-sm">
                  {note.content}
                </p>

                {/* Buttons + Date Row */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">
                    {note.editedAt
                      ? `Edited at: ${formatDate(note.editedAt)}`
                      : `Created at: ${formatDate(note.createdAt)}`}
                  </span>
                  <div className="flex gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openEditNoteModal(note)}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg animate-bounce transition transform hover:scale-110"
        onClick={() => setShowAddNote(!showAddNote)}
      >
        <IoMdAdd size={28} />
      </button>

      {/* Add/Edit Modals */}
      {(showAddNote || editNote) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md animate-fade-in relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowAddNote(false);
                setEditNote(false);
              }}
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editNote ? "Edit Note" : "Add Note"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full border border-gray-200 rounded-lg p-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              ref={editNote ? null : titleRef}
              value={editNote ? editTitle : undefined}
              onChange={
                editNote ? (e) => setEditTitle(e.target.value) : undefined
              }
            />
            <textarea
              placeholder="Content"
              className="w-full border border-gray-200 rounded-lg p-3 mb-4 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              ref={editNote ? null : contentRef}
              value={editNote ? editContent : undefined}
              onChange={
                editNote ? (e) => setEditContent(e.target.value) : undefined
              }
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition w-full"
              onClick={editNote ? handleEditNote : handleAddNote}
            >
              {editNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.4; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Notes;
