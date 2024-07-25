import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import { AddShipping } from "@/components/dashboards/shipping/AddShipping";
import { EditShipping } from "@/components/dashboards/shipping/EditShipping";
import { Search } from "@/components/ui/Search";
import { useShippingTable } from "@/hooks/dashboard/useShippingTable";
import { useTheme } from 'next-themes';
import { formatRupiah } from "@/utils/currency";

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

  const { theme } = useTheme();

  const columns = [
    { header: "No", accessorKey: "No" },
    { header: "Kota", accessorKey: "Kota" },
    { header: "Pulau", accessorKey: "Pulau" },
    { header: "Biaya", accessorKey: "Biaya" },
    { header: "Actions", accessorKey: "Actions" },
  ];

  const data =
    Array.isArray(shippings) &&
    shippings.map((shipping, index) => {
      return {
        No: index + 1 + (currentPage - 1) * 10,
        Kota: shipping.city,
        Pulau: shipping.region,
        Biaya: formatRupiah(shipping.fee),
        Actions: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="bg-gray-200 text-gray-700">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => handleEdit(shipping)}>
                <FiEdit className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(shipping.id)}>
                <FiTrash className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      };
    });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={`px-4 py-2 text-left text-sm font-medium`}
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

      {modalOpen && <AddShipping onClose={handleCloseModal} />}

      {editModalOpen && editShipping && (
        <EditShipping onClose={handleCloseEditModal} shipping={editShipping} />
      )}
    </div>
  );
};

export default ShippingTable;
