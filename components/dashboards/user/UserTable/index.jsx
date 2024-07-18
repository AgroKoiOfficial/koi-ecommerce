import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { EditUser } from "@/components/dashboards/user/EditUser";
import { useUserTable } from "@/hooks/dashboard/useUserTable";
import { Search } from "@/components/ui/Search";
import { useTheme } from 'next-themes';

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

  const { theme } = useTheme();

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Name", accessorKey: "Name" },
    { header: "Email", accessorKey: "Email" },
    { header: "Role", accessorKey: "Role" },
    { header: "Action", accessorKey: "Action" },
  ];

  const data =
    Array.isArray(users) &&
    users.map((user, index) => ({
      No: index + 1 + (currentPage - 1) * 10,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Action: (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="bg-gray-200 text-gray-700">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right">
            <DropdownMenuItem onClick={() => handleEdit(user)}>
              <FiEdit className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
              <FiTrash className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
        <Search onSearch={handleSearch} />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={`px-4 py-2 text-left text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-600"
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow
                key={index}
                className={`hover:${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                {Object.values(row).map((cell, idx) => (
                  <TableCell
                    key={idx}
                    className={`px-4 py-2 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>

        <div>
          Page{" "}
          <strong>
            {currentPage} of {totalPages}
          </strong>
        </div>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mr-2"
        >
          Next
        </Button>
      </div>

      {editModalOpen && editUser && (
        <EditUser onClose={handleCloseEditModal} user={editUser} />
      )}
    </div>
  );
};
