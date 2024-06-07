import React from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";

export const Review = ({ review }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= review.rating ? (
          <RiStarFill key={i} className="text-yellow-500 mr-1" />
        ) : (
          <RiStarLine key={i} className="text-gray-300 mr-1" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center mb-2">{renderStars()}</div>
      <p className="text-gray-700 mb-2">{review.comment}</p>
      <p className="text-gray-900 text-sm font-semibold">- {review.user?.name}</p>
    </div>
  );
};
