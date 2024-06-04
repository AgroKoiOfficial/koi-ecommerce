import React from "react";

export const TextArea = ({ ...props }) => {
  return (
    <textarea
      className="w-full p-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  );
};
