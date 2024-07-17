import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddCategory } from "@/components/dashboards/category/AddCategory";
import { EditCategory } from "@/components/dashboards/category/EditCategory";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";
import { useCategoryTable } from "@/hooks/dashboard/useCategoryTable";
import { useTheme } from 'next-themes';

export const CategoryTable = () => {
  const {
    categories,
    modalOpen,
    editModalOpen,
    editCategory,
    currentPage,
    totalPages,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    setCurrentPage,
    handleSearch,
  } = useCategoryTable();

  const { theme } = useTheme();

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Name", accessorKey: "Name" },
    { header: "Actions", accessorKey: "Actions" },
  ];

  const data =
    Array.isArray(categories) &&
    categories.map((category, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        Name: category.name,
        Actions: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-gray-200 text-gray-700">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <FiEdit className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(category.id)}>
                <FiTrash className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      };
    });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
        <Search onSearch={handleSearch} />
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleAdd}
        >
          <FiPlusCircle className="mr-2" /> Add Category
        </Button>
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
                className={`hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={handlePageChange}
      />

      {modalOpen && <AddCategory onClose={handleCloseModal} />}

      {editModalOpen && editCategory && (
        <EditCategory onClose={handleCloseEditModal} category={editCategory} />
      )}
    </div>
  );
};
