import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";

export const useAdminCart = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceFetchData = useCallback(
    debounce(async (query, page) => {
      try {
        const response = await fetch(
          `/api/cart?page=${page}&limit=10&search=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setCarts(data);
          const totalCarts = parseInt(
            response.headers.get("X-Total-Count"),
            10
          );
          setTotalPages(Math.ceil(totalCarts / 10));
        } else {
          console.error("Failed to fetch carts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debounceFetchData(searchQuery, currentPage);
  }, [searchQuery, currentPage, debounceFetchData]);

  useEffect(() => {
    const fetchCarts = async () => {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/cart/");
        if (!response.ok) {
          throw new Error("Failed to fetch carts");
        }
        const data = await response.json();
        setCarts(data);
      } catch (error) {
        console.error("Error fetching carts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/cart/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }
      setCarts(carts.filter((cart) => cart.id !== id));
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  return {
    carts,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    handleSearch,
    handlePageChange,
    handleDelete,
  };
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
