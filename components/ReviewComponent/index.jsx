import React from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { FiTrash } from "react-icons/fi";
import { Search } from "../ui/Search";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useRouter } from "next/router";
import useReviewComponent from "./useReviewComponent";
import { useTheme } from "next-themes";

const ReviewComponent = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    reviews,
    searchTerm,
    loading,
    totalReviews,
    session,
    handlePageChange,
    handleSearchChange,
    handleSearch,
    handleDeleteReview,
    page,
  } = useReviewComponent();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <RiStarFill key={i} className="text-yellow-500 mr-1" />
        ) : (
          <RiStarLine key={i} className="text-gray-300 mr-1" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4">
      <Search
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search reviews"
        onSearch={handleSearch}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap mt-4">
          {reviews.map((review) => (
            <div key={review.id} className="w-full md:w-1/2 lg:w-1/2 px-4 mb-4">
              <div className="flex items-start mb-2">
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="w-24 h-24 object-cover mr-2"
                />
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-md">User: {review.user.name}</p>
                      <p className="text-md">Product: {review.product.name}</p>
                      <p className="text-md">Comment: {review.comment}</p>
                    </div>
                    {session && (
                      <div className="w-8 h-8">
                        <Button
                          onClick={() => handleDeleteReview(review.id)}
                          className="focus:outline-none bg-red-500 hover:bg-red-600  rounded-md"
                          icon={<FiTrash className={`${theme === "dark" ? "text-white" : "text-black"}`} size={20} />}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalReviews / 10)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ReviewComponent;
