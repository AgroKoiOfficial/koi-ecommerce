import React from "react";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { Table } from "@/components/ui/Table";
import { Search } from "@/components/ui/Search";
import { Button } from "@/components/ui/Button";
import { AddShipping } from "../AddShipping";
import { EditShipping } from "../EditShipping";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination";
import { useShippingTable } from "../../../../hooks/dashboard/useShippingTable";

const ShippingTable = () => {
  const {
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
  } = useShippingTable();

  const columns = ["No", "City", "Region", "Fee", "Actions"];

  const data =
    Array.isArray(shippings) &&
    shippings.map((shipping, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        City: shipping.city,
        Region: shipping.region,
        Fee: formatRupiah(shipping.fee),
        Actions: (
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
              onClick={() => handleEdit(shipping)}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
              onClick={() => handleDelete(shipping.id)}
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
        {modalOpen && <AddShipping onClose={handleCloseModal} />}
        {editModalOpen && editShipping && (
          <EditShipping
            onClose={handleCloseEditModal}
            shipping={editShipping}
          />
        )}
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

export default ShippingTable;
