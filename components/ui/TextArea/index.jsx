import React from "react";
import { useTheme } from "next-themes";

export const TextArea = ({ ...props }) => {
  const { theme } = useTheme();
  return (
    <textarea
      className={`w-full p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500`}
      {...props}
    />
  );
};
