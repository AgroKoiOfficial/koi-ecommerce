import React, { useState, useEffect } from "react";
import {Review} from "../Review";

const GetReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review/productId/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews:", response.status);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div>
      {Array.isArray(reviews) && reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default GetReview;
