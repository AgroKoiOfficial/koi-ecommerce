import React from "react";

export const Table = ({ data, columns }) => {
  return (
    <div className="container mx-auto overflow-x-auto scrollbar-hide">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {Array.isArray(columns) && columns.map((column, index) => (
              <th key={index} className="px-4 py-2 lg:py-4 text-left text-xs sm:text-sm md:text-md lg:text-lg">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {Array.isArray(data) &&
            data.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} className="px-4 py-2 text-xs sm:text-sm md:text-md lg:text-lg">
                    {column === "Image" ? (
                      <img
                        src={row[column]}
                        alt={row[column]}
                        className="w-12 h-auto object-cover rounded-sm"
                      />
                    ) : column === "Video" && row[column] ? (
                      <video controls className="w-24 h-auto">
                        <source src={row[column]} type="video/mp4" />
                        <source src={row[column]} type="video/mpeg" />
                        <source src={row[column]} type="video/ogg" />
                        <source src={row[column]} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    ) : column === "Video" && !row[column] ? (
                      <span>No Video</span>
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
