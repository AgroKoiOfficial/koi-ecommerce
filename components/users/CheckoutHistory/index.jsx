import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";

const CheckoutHistory = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        return;
      }

      const fetchCheckouts = async () => {
        const response = await fetch(`/api/checkout/userId/${session.user.id}`);
        const data = await response.json();
        console.log("Checkouts:", data.checkouts);
        setCheckouts(data.checkouts);
      };

      fetchCheckouts();
    });
  }, []);

  const handleDeleteCheckout = async (checkoutId) => {
    const response = await fetch(`/api/checkout/delete/${checkoutId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCheckouts((prevCheckouts) =>
        prevCheckouts.filter((checkout) => checkout.id !== checkoutId)
      );
    }

    const data = await response.json();
    console.log("Checkout deleted:", data);
  };

  if (!checkouts) {
    return <div>Loading...</div>;
  }

  // Menghitung indeks awal dan akhir untuk data yang ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCheckouts = checkouts.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Array untuk menyimpan nomor halaman
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(checkouts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      {currentCheckouts.length > 0 ? (
        currentCheckouts.map((checkout) => (
          <div
            key={checkout.id}
            className="flex flex-col md:flex-row justify-between border-b-2 border-gray-300 p-4 rounded-lg shadow-md bg-white space-y-4 md:space-y-0 md:space-x-4"
          >
            <div className="flex flex-col md:flex-row md:w-2/3 space-y-2 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <Image
                  src={checkout.cart.create[0].product.image}
                  alt={checkout.cart.create[0].product.name}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "contain",
                    height: "100%",
                    width: "auto",
                    marginInline: "auto",
                    animation: "ease-in",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <div className="flex flex-col md:w-2/3 space-y-2">
                <div>
                  <p className="text-gray-700 font-semibold">Informasi Alamat:</p>
                  <p className="text-gray-500">
                    {checkout.shipping
                      ? `${checkout.shipping.city}, ${checkout.shipping.region}, Fee: ${formatRupiah(checkout.shipping.fee)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Alamat:</p>
                  <p className="text-gray-500">
                    {checkout.address
                      ? `${checkout.address.street}, ${checkout.address.city}, ${checkout.address.province}, ${checkout.address.postalCode}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Produk:</p>
                  <div className="flex flex-col space-y-2">
                    {checkout.cart.create.map((item) => (
                      <div key={item.id} className="flex flex-col space-y-2">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-gray-500">
                          Kuantitas: {item.quantity}
                        </p>
                        <p className="text-gray-500">
                          Harga: {formatRupiah(item.product.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end justify-center w-full md:w-1/3 space-y-2 md:space-y-0">
              <div className="flex flex-col items-center md:items-end">
                <p className="text-gray-700 font-semibold">Status:</p>
                <p className="text-gray-900">{checkout.status}</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <p className="text-gray-700 font-semibold">Total Checkout:</p>
                <p className="text-gray-900">{formatRupiah(checkout.total)}</p>
              </div>
              {/* <div className="flex flex-col items-center md:items-end space-y-2 mt-8">
                <Button
                  onClick={() => handleDeleteCheckout(checkout.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Tidak Ada Checkout.</p>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ul className="flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 ${
                  number === currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                } rounded-md`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CheckoutHistory;
