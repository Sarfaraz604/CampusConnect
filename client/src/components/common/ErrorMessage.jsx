import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 p-3 mb-4 rounded">
      <p className="text-red-700">{message}</p>
    </div>
  );
};

export default ErrorMessage;
