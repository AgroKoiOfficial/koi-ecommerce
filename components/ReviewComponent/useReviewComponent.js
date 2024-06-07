// useReviewComponent.js

import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const useReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); 
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const debouncedFetchReviews = useCallback(
    debounce(async (query, page) => {
      try {
        const res = await fetch(
          `/api/review?page=${page}&search=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
          const totalCount = res.headers.get("X-Total-Count");
          setTotalReviews(totalCount);
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchReviews(searchTerm, page);
    setLoading(true);
  }, [searchTerm, page, debouncedFetchReviews]);

  useEffect(() => {
    const getSessionData = async () => {
      const session = await getSession();
      setSession(session);
    };
    getSessionData();
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setPage(1);
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`/api/review/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted successfully");
        debouncedFetchReviews(searchTerm, page);
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again later.");
    }
  };

  return {
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
  };
};

export default useReviewComponent;
