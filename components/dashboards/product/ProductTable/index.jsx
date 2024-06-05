import React, { useState, useEffect } from "react";
import { Table } from "@/components/ui/Table";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { getSession } from "next-auth/react";
import { AddProduct } from "../AddProduct";
import { EditProduct } from "../EditProduct";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination"; 

export const ProductTable = () => {
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

  const columns = [
    "No",
    "Name",
    "Price",
    "Stock",
    "Category",
    "Image",
    "Video",
    "Actions",
  ];
  
  const data = Array.isArray(products) &&
    products.map((product, index) => {
      return {
        No: index + 1 + (currentPage - 1) * limit,
        Name: product.name,
        Price: formatRupiah(product.price),
        Stock: product.stock,
        Category: product.category,
        Image: product.image,
        Video: product.video,
        Actions: (
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
              onClick={() => handleEdit(product)}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
              onClick={() => handleDelete(product.id)}
            />
          </div>
        ),
      };
    });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
      <div className="max-w-[15%] my-2 px-4 sm:px-6 lg:px-8">
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          icon={<FiPlusCircle />}
        />
      </div>
      {modalOpen && <AddProduct onClose={handleCloseModal} />}
      {editModalOpen && editProduct && <EditProduct onClose={handleCloseEditModal} product={editProduct} />}
      <div className="container overflow-auto scrollbar-hide">
        <Table columns={columns} data={data} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};
