import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { EditFaq } from "@/components/dashboards/faqs/EditFaq";
import { AddFaq } from "@/components/dashboards/faqs/AddFaq";
import { useFaqTable } from "@/hooks/dashboard/useFaqTable";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Search } from "@/components/ui/Search";
import { columns } from "./columns";

export const FaqTable = () => {
  const {
    faqs,
    modalOpen,
    editModalOpen,
    editCategory,
    currentPage,
    totalPages,
    limit,
    searchQuery,
    setCurrentPage,
    handleSearch,
    handleAdd,
    handleCloseModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
  } = useFaqTable();

  const data =
    Array.isArray(faqs) &&
    faqs.map((faq, index) => {
      return {
        No: index + 1 + (currentPage - 1) * limit,
        Slug: faq.slug,
        Question: faq.question,
        Answer: faq.answer,
        Category: faq.category,
        Action: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-gray-200 text-gray-700">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => handleEdit(faq)}>
                <FiEdit className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(faq.id)}>
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
      <div className="flex justify-between items-center">
        <Search onSearch={handleSearch} />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={handleAdd}
        >
          Add FAQ
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full border-collapse border border-gray-200">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="border border-gray-200">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={index} className="border border-gray-200">
                {Object.values(row).map((cell, idx) => (
                  <TableCell key={idx} className="border border-gray-200">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center space-x-6 mt-4">
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

      {modalOpen && <AddFaq onClose={handleCloseModal} />}
      {editModalOpen && editCategory && (
        <EditFaq onClose={handleCloseEditModal} faq={editCategory} />
      )}
    </div>
  );
};
