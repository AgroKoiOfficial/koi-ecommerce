import React from "react";

const LoadingCard = () => {
  return (
    <div className="animate-pulse p-4 border rounded-md shadow-md">
      <div className="bg-gray-300 h-48 w-full mb-4"></div>
      <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
      <div className="bg-gray-300 h-6 w-1/2 mb-2"></div>
      <div className="bg-gray-300 h-4 w-full mb-4"></div>
      <div className="bg-gray-300 h-8 w-1/4"></div>
    </div>
  );
};

export default LoadingCard;
