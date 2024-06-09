import React from "react";
import { Table } from "@/components/ui/Table";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { EditUser } from "../EditUser";
import { useUserTable } from "../../../../hooks/dashboard/useUserTable";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";

export const UserTable = () => {
  const {
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
  } = useUserTable();

  const columns = ["No", "Name", "Email", "Role", "Action"];

  const data =
    Array.isArray(users) &&
    users.map((user, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Action: (
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
              onClick={() => handleEdit(user)}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
              onClick={() => handleDelete(user.id)}
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
      </div>
      {editModalOpen && editUser && (
        <EditUser onClose={handleCloseEditModal} user={editUser} />
      )}

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
