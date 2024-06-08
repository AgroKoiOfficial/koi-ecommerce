import React from "react";
import { Table } from "@/components/ui/Table";
import { FiTrash } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";
import { useAdminCart } from "./useAdminCart";

export const AdminCart = () => {
  const {
    carts,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    handleSearch,
    handlePageChange,
    handleDelete,
  } = useAdminCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (carts.length === 0) {
    return <div className="text-center">No carts found</div>;
  }

  const columns = [
    "No",
    "User",
    "Product Name",
    "Image",
    "Total",
    "Quantity",
    "Actions",
  ];

  const data =
    Array.isArray(carts) &&
    carts.map((cart, index) => ({
      No: index + 1 + (currentPage - 1) * 10,
      User: `${cart.user.name}`,
      "Product Name": cart.product.name,
      Image: cart.product.image,
      Total: formatRupiah(cart.total),
      Quantity: cart.quantity,
      Actions: (
        <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            icon={<FiTrash />}
            onClick={() => handleDelete(cart.id)}
          />
        </div>
      ),
    }));

  return (
    <div className="container mx-auto overflow-auto scrollbar-hide">
      <div className="flex flex-col md:flex-row justify-between items-center my-2 px-4 sm:px-6 lg:px-8">
        <div className="flex w-3/4 items-center space-x-2">
          <Search onSearch={handleSearch} />
        </div>
      </div>
      <div className="container overflow-auto scrollbar-hide">
        <Table columns={columns} data={data} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
