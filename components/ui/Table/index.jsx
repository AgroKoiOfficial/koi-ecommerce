import React from "react";

export const Table = ({ data, columns }) => {
  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
      <div className="container overflow-auto scrollbar-hide">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {Array.isArray(columns) && columns.map((column, index) => (
              <th key={index} className="px-4 py-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {Array.isArray(data) &&
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} className="border px-4 py-2">
                    {column === "Image" ? (
                      <img
                        src={row[column]}
                        alt={row[column]}
                        className="w-12 h-auto"
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
    </div>
  );
};

