import React, { useState } from "react";

export const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};
