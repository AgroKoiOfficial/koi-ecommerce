import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { FiTrash } from "react-icons/fi";
import useCheckoutStore from "@/stores/checkoutStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "@/components/ui/Search";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const CheckoutList = () => {
  const { theme } = useTheme();
  const {
    checkouts,
    currentPage,
    itemsPerPage,
    setCheckouts,
    setCurrentPage,
  } = useCheckoutStore((state) => ({
    checkouts: state.checkouts,
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    setCheckouts: state.setCheckouts,
    setCurrentPage: state.setCurrentPage,
  }));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        setError("Access denied");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/checkout");
        const data = await response.json();
        if (response.ok) {
          setCheckouts(data.checkouts);
        } else {
          setError(data.message || "Failed to fetch checkouts");
        }
      } catch (err) {
        setError("Failed to fetch checkouts");
      }
      setLoading(false);
    };

    fetchData();
  }, [setCheckouts]);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/checkout/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCheckouts((prevCheckouts) =>
          prevCheckouts.filter((checkout) => checkout.id !== id)
        );
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete checkout");
      }
    } catch (err) {
      setError("Failed to delete checkout");
    }
    setDeleteLoading(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentCheckouts = Array.isArray(checkouts)
    ? checkouts.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = Array.isArray(checkouts)
    ? Math.ceil(checkouts.length / itemsPerPage)
    : 0;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCheckouts = Array.isArray(checkouts)
    ? checkouts.filter((checkout) =>
        checkout.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) return <p className="font-bold">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const columns = [
    { header: "No", accessorKey: "no" },
    { header: "Total", accessorKey: "total" },
    { header: "Quantity", accessorKey: "quantity" },
    { header: "Status", accessorKey: "status" },
    { header: "User", accessorKey: "user" },
    { header: "Products", accessorKey: "products" },
    { header: "Address", accessorKey: "address" },
    { header: "Shipping", accessorKey: "shipping" },
    { header: "Coupon", accessorKey: "coupon" },
    { header: "Actions", accessorKey: "actions" },
  ];

  const data = filteredCheckouts
    .slice(indexOfFirstItem, indexOfLastItem)
    .map((checkout, index) => ({
      no: indexOfFirstItem + index + 1,
      total: checkout.total,
      quantity: checkout.quantity,
      status: checkout.status,
      user: `${checkout.user.name} (${checkout.user.email})`,
      products: checkout.cart.map((item) => (
        <div key={item.id}>
          {item.product.name} (Qty: {item.quantity})
        </div>
      )),
      address: `${checkout.address.city}, ${checkout.address.province}, ${checkout.address.phone}`,
      shipping: `${checkout.shipping.city}, ${checkout.shipping.region}, ${checkout.shipping.fee}`,
      coupon: checkout.coupon
        ? `${checkout.coupon.code} (${checkout.coupon.discountType})`
        : "N/A",
      actions: (
        <Button
          onClick={() => handleDelete(checkout.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={deleteLoading}
        >
          <FiTrash />
        </Button>
      ),
    }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center font-bold mb-4">Checkout List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <Table className={`min-w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} border border-gray-200`}>
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
            {data.map((row, index) => (
              <TableRow key={index} className={`hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                {Object.values(row).map((cell, idx) => (
                  <TableCell key={idx} className={`px-4 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

export default CheckoutList;
