import React from "react";
import { Table } from "@/components/ui/Table";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { AddProduct } from "../AddProduct";
import { EditProduct } from "../EditProduct";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination"; 
import { Search } from "@/components/ui/Search";
import { useProductTable } from "../../../../hooks/dashboard/useProductTable";

export const ProductTable = () => {
  const {
    products,
    modalOpen,
    editModalOpen,
    editProduct,
    currentPage,
    totalPages,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
    handleSearch,
  } = useProductTable();

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
        No: index + 1 + (currentPage - 1) * 10,
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
      <div className="flex flex-col md:flex-row justify-between items-center my-2 px-4 sm:px-6 lg:px-8">
        <div className="flex w-3/4 items-center space-x-2">
        <Search onSearch={handleSearch} />
        </div>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          icon={<FiPlusCircle />}
        />
        </div>
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
