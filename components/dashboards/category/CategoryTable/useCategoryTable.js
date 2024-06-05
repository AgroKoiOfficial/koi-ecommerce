import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";

export const useCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceFetchData = useCallback(debounce(async (query, page) => {
    try {
      const response = await fetch(`/api/categories?page=${page}&limit=${limit}&search=${query}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        const totalCategories = parseInt(response.headers.get("X-Total-Count"), 10);
        setTotalPages(Math.ceil(totalCategories / limit));
      } else {
        console.error("Failed to fetch categories:", response.status);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, 300), [limit]);

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

  const handleDelete = async (categoryId) => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        console.error("Unauthorized");
        return;
      }

      const response = await fetch(`/api/categories/delete/${categoryId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryId));
      } else {
        console.error("Failed to delete category:", response.status);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return {
    categories,
    modalOpen,
    editModalOpen,
    editCategory,
    currentPage,
    totalPages,
    limit,
    searchQuery,
    handleSearch,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
  };
};

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
