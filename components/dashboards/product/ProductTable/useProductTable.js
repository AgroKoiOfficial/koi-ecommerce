import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export const useProductTable = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/products?page=${currentPage}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          const totalProducts = parseInt(response.headers.get("X-Total-Count"), 10);
          setTotalPages(Math.ceil(totalProducts / limit));
        } else {
          console.error("Failed to fetch products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();

    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, [currentPage, limit]);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products/delete/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        console.error("Failed to delete product:", response.status);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return {
    products,
    modalOpen,
    editModalOpen,
    editProduct,
    session,
    currentPage,
    totalPages,
    limit,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
  };
};
