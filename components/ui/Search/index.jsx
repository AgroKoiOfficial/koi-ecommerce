import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};
