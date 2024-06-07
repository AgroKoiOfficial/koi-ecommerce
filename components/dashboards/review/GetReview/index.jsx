import React, { useState, useEffect } from "react";
import { Review } from "../Review";

const GetReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review/productId/${productId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
            setMessage("Tidak ada atau belum ada review");
          } else {
            setReviews(data);
          }
        } else if (response.status === 404) {
          setMessage("Tidak ada atau belum ada review");
        } else {
          setMessage("Failed to fetch reviews");
          console.error("Failed to fetch reviews:", response.status);
        }
      } catch (error) {
        setMessage("Error fetching reviews");
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div>
      {message && <p>{message}</p>}
      {Array.isArray(reviews) && reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default GetReview;
