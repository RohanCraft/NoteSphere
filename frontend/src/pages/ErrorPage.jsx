// src/pages/ErrorPage.jsx
import React from "react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600">
          Something went wrong or the page was not found.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
