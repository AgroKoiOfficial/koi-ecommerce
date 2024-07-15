import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import useCheckoutStore from "@/stores/checkoutStore";

const CheckoutList = () => {
  const { checkouts, currentPage, itemsPerPage, setCheckouts, setCurrentPage } =
    useCheckoutStore((state) => ({
      checkouts: state.checkouts,
      currentPage: state.currentPage,
      itemsPerPage: state.itemsPerPage,
      setCheckouts: state.setCheckouts,
      setCurrentPage: state.setCurrentPage,
    }));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCheckouts = checkouts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(checkouts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCheckouts = checkouts.filter((checkout) =>
    checkout.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">No</th>
              <th className="px-4 py-2 border-b">Total</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">User</th>
              <th className="px-4 py-2 border-b">Products</th>
              <th className="px-4 py-2 border-b">Address</th>
              <th className="px-4 py-2 border-b">Shipping</th>
              <th className="px-4 py-2 border-b">Coupon</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheckouts.map((checkout, index) => (
              <tr key={checkout.id}>
                <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-2">{checkout.total}</td>
                <td className="px-4 py-2">{checkout.quantity}</td>
                <td className="px-4 py-2">{checkout.status}</td>
                <td className="px-4 py-2">
                  {checkout.user.name} ({checkout.user.email})
                </td>
                <td className="px-4 py-2">
                  {checkout.cart.map((item) => (
                    <div key={item.id}>
                      {item.product.name} (Qty: {item.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  {checkout.address.city}, {checkout.address.province}, {checkout.address.phone}
                </td>
                <td className="px-4 py-2">
                  {checkout.shipping.city}, {checkout.shipping.region}, {checkout.shipping.fee}
                </td>
                <td className="px-4 py-2">
                  {checkout.coupon ? `${checkout.coupon.code} (${checkout.coupon.discountType})` : 'N/A'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(checkout.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white focus:outline-none"
              >
                Prev
              </button>
            </li>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "text-blue-500 hover:bg-blue-400"
                  } px-4 py-2 mx-1 rounded-lg focus:outline-none`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            {totalPages > 10 && (
              <li>
                <span className="px-4 py-2 mx-1">...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white focus:outline-none"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CheckoutList;
