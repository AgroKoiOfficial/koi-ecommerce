import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";

export const useShippingTable = () => {
  const [shippings, setShippings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editShipping, setEditShipping] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceFetchData = useCallback(
    debounce(async (query, page) => {
      try {
        const response = await fetch(
          `/api/shippings?page=${page}&limit=${limit}&search=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setShippings(data);
          const totalShippings = parseInt(
            response.headers.get("X-Total-Count"),
            10
          );
          setTotalPages(Math.ceil(totalShippings / limit));
        } else {
          console.error("Failed to fetch shippings:", response.status);
        }
      } catch (error) {
        console.error("Error fetching shippings:", error);
      }
    }, 300),
    [limit]
  );

  useEffect(() => {
    debounceFetchData(searchQuery, currentPage);
  }, [searchQuery, currentPage, debounceFetchData]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (shipping) => {
    setEditShipping(shipping);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditShipping(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/shippings/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShippings(shippings.filter((shipping) => shipping.id !== id));
      } else {
        console.error("Failed to delete shipping:", response.status);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return {
    shippings,
    modalOpen,
    editModalOpen,
    editShipping,
    currentPage,
    totalPages,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
    handleSearch,
    session,
  };
};

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
