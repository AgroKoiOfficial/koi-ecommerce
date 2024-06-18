import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useFaqTable = () => {
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceFetchData = useCallback(
    debounce(async (query, page) => {
      try {
        const response = await fetch(
          `/api/faqs?page=${page}&limit=${limit}&search=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setFaqs(data);
          const totalFaqs = parseInt(
            response.headers.get("X-Total-Count"),
            10
          );
          setTotalPages(Math.ceil(totalFaqs / limit));
        } else {
          console.error("Failed to fetch FAQs:", response.status);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    }, 300),
    [limit]
  );

  useEffect(() => {
    debounceFetchData(searchQuery, currentPage);
  }, [searchQuery, currentPage, debounceFetchData]);

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

  const handleEdit = (category) => {
    setEditCategory(category);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditCategory(null);
  };

  const handleDelete = async (id) => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        console.error("Unauthorized");
        return;
      }

      const response = await fetch(`/api/faqs/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFaqs(faqs.filter((category) => category.id !== id));
      }

      toast.success("FAQ deleted successfully");
    } catch (error) {
      toast.error("Failed to delete FAQ");
      console.error("Error deleting category:", error);
    }
  };

  return {
    faqs,
    modalOpen,
    editModalOpen,
    editCategory,
    currentPage,
    totalPages,
    limit,
    searchQuery,
    setCurrentPage,
    handleSearch,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
  };
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}
