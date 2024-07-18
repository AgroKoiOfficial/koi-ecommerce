import * as React from "react";
import Image from "next/image";
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
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddProduct } from "@/components/dashboards/product/AddProduct";
import { EditProduct } from "@/components/dashboards/product/EditProduct";
import { Search } from "@/components/ui/Search";
import { formatRupiah } from "@/utils/currency";
import { useProductTable } from "@/hooks/dashboard/useProductTable";
import { useTheme } from 'next-themes';
import { useTable, usePagination } from 'react-table';

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

  const columns = React.useMemo(
    () => [
      { Header: "No", accessor: "No" },
      { Header: "Name", accessor: "Name" },
      { Header: "Price", accessor: "Price" },
      { Header: "Stock", accessor: "Stock" },
      { Header: "Category", accessor: "Category" },
      { Header: "Image", accessor: "Image" },
      { Header: "Video", accessor: "Video" },
      { Header: "Actions", accessor: "Actions" },
    ],
    []
  );

  const data = React.useMemo(() => {
    return (
      Array.isArray(products) &&
      products.map((product, index) => ({
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
      }))
    );
  }, [products, currentPage]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage - 1 },
      manualPagination: true,
      pageCount: totalPages,
    },
    usePagination
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    gotoPage(pageNumber - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0 md:space-x-4">
        <Search onSearch={handleSearch} />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white w-1/4"
          onClick={handleAdd}
        >
          <FiPlusCircle  /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table {...getTableProps()} className="min-w-full">
          <TableHeader>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableHead
                    {...column.getHeaderProps()}
                    className={`px-4 py-2 text-left text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {column.render("Header")}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  key={index}
                  className={`hover:${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  {row.cells.map((cell, idx) => (
                    <TableCell
                      key={idx}
                      {...cell.getCellProps()}
                      className={`px-4 py-2 text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canPreviousPage}
          className="mr-2"
        >
          Previous
        </Button>

        <div>
          Page{" "}
          <strong>
            {pageIndex + 1} of {totalPages}
          </strong>
        </div>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canNextPage}
          className="mr-2"
        >
          Next
        </Button>
      </div>

      {modalOpen && <AddProduct onClose={handleCloseModal} />}

      {editModalOpen && editProduct && (
        <EditProduct onClose={handleCloseEditModal} product={editProduct} />
      )}
    </div>
  );
};
