import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddCategory } from "@/components/dashboards/category/AddCategory";
import { EditCategory } from "@/components/dashboards/category/EditCategory";
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Search onSearch={handleSearch} />
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleAdd}
        >
          <FiPlusCircle />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead
                className={`px-4 py-2 text-left text-sm font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-600"
                }`}
              >
                No
              </TableHead>
              <TableHead
                className={`px-4 py-2 text-left text-sm font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-600"
                }`}
              >
                Name
              </TableHead>
              <TableHead
                className={`px-4 py-2 text-left text-sm font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-600"
                }`}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow
                key={index}
                className={`hover:${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <TableCell
                  className={`px-4 py-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {index + 1 + (currentPage - 1) * 10}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {category.name}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
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
                </TableCell>
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

      {modalOpen && <AddCategory onClose={handleCloseModal} />}

      {editModalOpen && editCategory && (
        <EditCategory onClose={handleCloseEditModal} category={editCategory} />
      )}
    </div>
  );
};
