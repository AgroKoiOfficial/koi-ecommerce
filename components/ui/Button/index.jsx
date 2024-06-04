import React from "react";

export const Button = ({ children, className, icon, ...props }) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center px-4 py-2 rounded-md ${className}`}
      {...props}>
      {icon && <span>{icon}</span>}
      <span className="text-center">{children}</span>
    </button>
  );
};
