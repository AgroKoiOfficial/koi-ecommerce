import React from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useTheme } from "next-themes";

export const Review = ({ review }) => {
  const { theme } = useTheme();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= review.rating ? (
          <RiStarFill key={i} className={theme === "dark" ? "text-yellow-400 mr-1" : "text-yellow-500 mr-1"} />
        ) : (
          <RiStarLine key={i} className={theme === "dark" ? "text-gray-500 mr-1" : "text-gray-300 mr-1"} />
        )
      );
    }
    return stars;
  };

  const reviewBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const reviewTextClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const reviewerTextClass = theme === "dark" ? "text-gray-400" : "text-gray-900";

  return (
    <div className={`rounded-lg p-4 shadow-md mb-4 ${reviewBgClass}`}>
      <div className="flex items-center mb-2">{renderStars()}</div>
      <p className={`${reviewTextClass} mb-2`}>{review.comment}</p>
      <p className={`text-sm font-semibold ${reviewerTextClass}`}>- {review.user?.name}</p>
    </div>
  );
};
