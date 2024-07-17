import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiTrash } from "react-icons/fi";
import { formatRupiah } from "@/utils/currency";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";
import { useAdminCart } from "@/hooks/dashboard/useAdminCart";
import { useTheme } from 'next-themes';

export const AdminCart = () => {
  const {
    carts,
    loading,
    currentPage,
    totalPages,
    handleSearch,
    handlePageChange,
    handleDelete,
  } = useAdminCart();

  const { theme } = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!carts || carts.length === 0) {
    return <div className="text-center">No carts found</div>;
  }

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "User Name", accessorKey: "User Name" },
    { header: "Product Name", accessorKey: "Product Name" },
    { header: "Image", accessorKey: "Image" },
    { header: "Total", accessorKey: "Total" },
    { header: "Quantity", accessorKey: "Quantity" },
    { header: "Actions", accessorKey: "Actions" },
  ];

  const data =
    Array.isArray(carts) &&
    carts.map((cart, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        "User Name": cart.user.name,
        "Product Name": cart.product.name,
        Image: <img src={cart.product.image} alt={cart.product.name} className="w-16 h-16 object-cover" />,
        Total: formatRupiah(cart.total),
        Quantity: cart.quantity,
        Actions: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-gray-200 text-gray-700">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => handleDelete(cart.id)}>
                <FiTrash className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      };
    });

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
    </div>
  );
};
