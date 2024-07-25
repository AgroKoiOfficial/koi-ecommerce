import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";
import { useCart } from "../../hooks/useCart";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cartData,
    handleDeleteItem,
    handleUpdateQuantity,
    calculateTotalQuantity,
    calculateTotalPrice,
  } = useCart();

  const { theme } = useTheme();

  const handleCheckout = async () => {
    if (session) {
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };

  const calculateTimeLeft = (expiresAt) => {
    const difference = new Date(expiresAt) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      cartData.forEach(item => {
        setTimeLeft(prevState => ({
          ...prevState,
          [item.id]: calculateTimeLeft(item.expiresAt)
        }));
      });
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <Head>
        <title>Cart - Jual Ikan Koi</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="cart" />
      </Head>
      <main className={`pt-8 overflow-y-auto mx-auto scrollbar-hide `}>
        {cartData.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row items-center mt-8 mb-4 mx-4 relative rounded-lg shadow-md p-4`}>
            <Link
              href={`/products/${item.product.slug}`}
              key={item.id}
              className="inset-0">
              <div className="flex justify-center md:justify-start items-center md:mr-4">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  priority={true}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              </div>
            </Link>
            <div className="flex-1  md:ml-4 mt-4">
              <p className="text-sm md:text-md lg:text-lg mb-2">
                {item.product.name}
              </p>
              <p className="text-sm md:text-md lg:text-lg mb-2">
                Harga: {formatRupiah(item.product.price)}
              </p>
              <div className="flex items-center mt-2 md:mt-4 w-8 ">
                <Button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 mr-2">
                  <FaMinus className="text-gray-600" />
                </Button>
                <p className="px-4 py-1 bg-gray-100 text-gray-800">
                  {item.quantity}
                </p>
                <Button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 ml-2">
                  <FaPlus className="text-gray-600" />
                </Button>
              </div>
              {timeLeft[item.id] && (
                <p className="text-red-600 mt-2">
                  Produk akan dihapus otomatis dalam: {timeLeft[item.id].hours} jam, {timeLeft[item.id].minutes} menit, {timeLeft[item.id].seconds} detik
                </p>
              )}
            </div>
            <div className="ml-auto mt-4 md:mt-0">
              <Button onClick={() => handleDeleteItem(item.id)} className='bg-transparent'>
                <FaTrash className="text-red-600 hover:text-red-800 w-6 h-6" />
              </Button>
            </div>
          </div>
        ))}
        {cartData.length > 0 && (
          <div className="mt-8 mx-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">Total Kuantiti:</p>
              <p className="text-lg font-semibold">{calculateTotalQuantity()}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-lg font-semibold">Total Harga:</p>
              <p className="text-lg font-semibold">
                {formatRupiah(calculateTotalPrice())}
              </p>
            </div>
          </div>
        )}
        {cartData.length === 0 && (
          <div className="min-h-screen mt-8 mx-4 border-t border-gray-200 pt-4">
            <p className="text-center mt-16 text-3xl font-bold">
              Keranjang Anda Kosong
            </p>
            <div className="flex justify-center w-48 items-center mx-auto">
              <Button
                className="w-full mx-auto mt-8 bg-gradient-to-r from-red-700 to-red-500 text-white"
                onClick={() => router.push("/products")}>
                Lanjut Belanja
              </Button>
            </div>
          </div>
        )}
        {cartData.length > 0 && (
          <div className="flex items-center justify-center mx-auto mt-8 p-4 md:px-16 lg:px-96">
            <Button onClick={handleCheckout} className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Checkout
            </Button>
          </div>
        )}
      </main>
    </>
  );
}

export default Cart;
