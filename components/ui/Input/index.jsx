import React, { forwardRef } from "react";

export const Input = forwardRef(({ type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      {...props}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
  );
});
