import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddProduct } from "@/components/dashboards/product/AddProduct";
import { EditProduct } from "@/components/dashboards/product/EditProduct";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";
import { useProductTable } from "@/hooks/dashboard/useProductTable";
import { useTheme } from 'next-themes';

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
  
  const { theme } = useTheme();

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Name", accessorKey: "Name" },
    { header: "Price", accessorKey: "Price" },
    { header: "Stock", accessorKey: "Stock" },
    { header: "Category", accessorKey: "Category" },
    { header: "Image", accessorKey: "Image" },
    { header: "Video", accessorKey: "Video" },
    { header: "Actions", accessorKey: "Actions" },
  ];

  const data =
    Array.isArray(products) &&
    products.map((product, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        Name: product.name,
        Price: formatRupiah(product.price),
        Stock: product.stock,
        Category: product.category,
        Image: (
          <div className="w-24 h-24 relative">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        ),
        Video: product.video ? (
          <div className="w-24 h-24">
            <video
              controls
              className="rounded-md"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
              <source src={product.video} type="video/mp4" />
              <source src={product.video} type="video/ogg" />
              <source src={product.video} type="video/webm" />
              <source src={product.video} type="video/mpeg" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <span>Video tidak ada</span>
        ),
        Actions: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-gray-200 text-gray-700">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <FiEdit className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product.id)}>
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
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={handleAdd}
        >
          <FiPlusCircle className="mr-2" /> Add Product
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

      {modalOpen && <AddProduct onClose={handleCloseModal} />}

      {editModalOpen && editProduct && (
        <EditProduct onClose={handleCloseEditModal} product={editProduct} />
      )}
    </div>
  );
};
