import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { formatRupiah } from "@/utils/currency";
import { useTheme } from "next-themes";

const CheckoutHistory = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        return;
      }

      const fetchCheckouts = async () => {
        const response = await fetch(`/api/checkout/userId/${session.user.id}`);
        const data = await response.json();
        setCheckouts(data.checkouts);
      };

      fetchCheckouts();
    });
  }, []);

  if (!checkouts) {
    return <div>Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCheckouts = checkouts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(checkouts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const containerBgColor = resolvedTheme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = resolvedTheme === "dark" ? "border-gray-600" : "border-gray-300";
  const textColor = resolvedTheme === "dark" ? "text-gray-200" : "text-gray-700";
  const subTextColor = resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500";
  const statusTextColor = resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900";
  const buttonBgColor = resolvedTheme === "dark" ? "bg-gray-600" : "bg-gray-300";
  const buttonTextColor = resolvedTheme === "dark" ? "text-gray-200" : "text-gray-700";
  const activeButtonBgColor = resolvedTheme === "dark" ? "bg-blue-600" : "bg-blue-500";

  const isExpired = (checkout) => {
    const creationTime = new Date(checkout.createdAt);
    const currentTime = new Date();
    const expirationTime = new Date(creationTime.getTime() + 6 * 60 * 60 * 1000); // 6 hours

    return currentTime > expirationTime;
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      {currentCheckouts.length > 0 ? (
        currentCheckouts.map((checkout) => (
          <div
            key={checkout.id}
            className={`flex flex-col md:flex-row justify-between border-b-2 ${borderColor} p-4 rounded-lg shadow-md ${containerBgColor} space-y-4 md:space-y-0 md:space-x-4`}
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
                  <p className={`font-semibold ${textColor}`}>Informasi Alamat:</p>
                  <p className={subTextColor}>
                    {checkout.shipping
                      ? `${checkout.shipping.city}, ${checkout.shipping.region}, Fee: ${formatRupiah(checkout.shipping.fee)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`font-semibold ${textColor}`}>Alamat:</p>
                  <p className={subTextColor}>
                    {checkout.address
                      ? `${checkout.address.street}, ${checkout.address.city}, ${checkout.address.province}, ${checkout.address.postalCode}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`font-semibold ${textColor}`}>Produk:</p>
                  <div className="flex flex-col space-y-2">
                    {checkout.cart.create.map((item) => (
                      <div key={item.id} className="flex flex-col space-y-2">
                        <p className={`font-semibold ${textColor}`}>{item.product.name}</p>
                        <p className={subTextColor}>Kuantitas: {item.quantity}</p>
                        <p className={subTextColor}>Harga: {formatRupiah(item.product.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end justify-center w-full md:w-1/3 space-y-2 md:space-y-0">
              <div className="flex flex-col items-center md:items-end">
                <p className={`font-semibold ${textColor}`}>Status:</p>
                <p className={statusTextColor}>{checkout.status}</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <p className={`font-semibold ${textColor}`}>Total Checkout:</p>
                <p className={statusTextColor}>{formatRupiah(checkout.total)}</p>
                {checkout.redirectUrl && (
                  <p className={`mb-2 ${subTextColor}`}>
                    {isExpired(checkout) ? (
                      <span className="text-red-500">Link Pembayaran Sudah Kadaluarsa</span>
                    ) : (
                      <Link
                        href={checkout.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Lanjutkan Pembayaran
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Tidak Ada Checkout.</p>
      )}

      <div className="mt-4 flex justify-center">
        <ul className="flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 ${
                  number === currentPage
                    ? `${activeButtonBgColor} text-white`
                    : `${buttonBgColor} ${buttonTextColor}`
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
