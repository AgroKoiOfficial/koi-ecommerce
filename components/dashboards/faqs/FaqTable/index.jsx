import React from "react";
import { Table } from "@/components/ui/Table";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { AddFaq } from "@/components/dashboards/faqs/AddFaq";
import { EditFaq } from "@/components/dashboards/faqs/EditFaq";
import { useFaqTable } from "@/hooks/dashboard/useFaqTable";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";

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

  const columns = ["No", "Slug", "Question", "Answer", "Category", "Action"];

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
          <div className="flex max-w-[25%] items-center justify-center space-x-1 mx-auto">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              icon={<FiEdit />}
              onClick={() => handleEdit(faq)}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<FiTrash />}
              onClick={() => handleDelete(faq.id)}
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

      <Table columns={columns} data={data} />

      {modalOpen && <AddFaq onClose={handleCloseModal} />}

      {editModalOpen && editCategory && (
        <EditFaq onClose={handleCloseEditModal} faq={editCategory} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
