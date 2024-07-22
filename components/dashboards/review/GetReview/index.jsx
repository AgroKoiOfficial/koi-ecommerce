import React, { useState, useEffect } from "react";
import { Review } from "../Review";

const GetReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/review/productId/${productId}`);
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data) && data.length === 0) {
            setMessage("Tidak ada atau belum ada review");
          } else if (data.error) {
            setMessage(data.error);
          } else {
            setReviews(data);
          }
        } else {
          setMessage("Failed to fetch reviews");
        }
      } catch {
        setMessage("Error fetching reviews");
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
