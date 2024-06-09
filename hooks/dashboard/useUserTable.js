import { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";

export const useUserTable = () => {
  const [users, setUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceFetchData = useCallback(
    debounce(async (query, page) => {
      try {
        const response = await fetch(
          `/api/user?page=${page}&limit=${limit}&search=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          const totalUsers = parseInt(
            response.headers.get("X-Total-Count"),
            10
          );
          setTotalPages(Math.ceil(totalUsers / limit));
        } else {
          console.error("Failed to fetch users:", response.status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleEdit = (user) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditUser(null);
  };

  const handleDelete = async (userId) => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        return;
      }

      const response = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        console.error("Failed to delete user:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    users,
    editModalOpen,
    editUser,
    currentPage,
    totalPages,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
    handleSearch,
  };
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};