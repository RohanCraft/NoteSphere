// src/App.jsx
import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Put a single ToastContainer at the app root
const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Login />, errorElement: <ErrorPage /> },
    { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
    { path: "/notes", element: <Notes />, errorElement: <ErrorPage /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
