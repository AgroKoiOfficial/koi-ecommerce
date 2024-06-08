import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";
import { useCart } from "./useCart";
import Link from "next/link";

function Cart() {
  const router = useRouter();
  const {
    cartData,
    handleDeleteItem,
    handleUpdateQuantity,
    calculateTotalQuantity,
    calculateTotalPrice,
  } = useCart();

  return (
    <>
      <Head>
        <title>Cart - Jual Ikan Koi</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffffff" />
       <meta name="description" content="cart" />
      </Head>
    <main className="pt-20 lg:pt-24 overflow-y-auto mx-auto mb-56 scrollbar-hide">
      {cartData.map((item) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row items-center mt-8 mb-4 mx-4 relative bg-white rounded-lg shadow-md p-4">
          <Link
            href={`/products/${item.product.id}`}
            key={item.id}
            className=" inset-0">
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
          <div className="flex-1 md:ml-4">
            <p className="text-sm md:text-md lg:text-lg mb-2">
              {item.product.name}
            </p>
            <p className="text-sm md:text-md lg:text-lg mb-2">
              Price: {formatRupiah(item.product.price)}
            </p>
            <div className="flex items-center mt-2 md:mt-4 w-8 ">
              <Button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-2">
                <FaMinus className="text-gray-600" />
              </Button>
              <p className="px-4 py-1 bg-gray-100 text-gray-800">
                {item.quantity}
              </p>
              <Button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-2">
                <FaPlus className="text-gray-600" />
              </Button>
            </div>
          </div>
          <div className="ml-auto mt-4 md:mt-0">
            <Button onClick={() => handleDeleteItem(item.id)}>
              <FaTrash className="text-red-600 hover:text-red-800 w-6 h-6" />
            </Button>
          </div>
        </div>
      ))}
      {cartData.length > 0 && (
        <div className="mt-8 mx-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Total Quantity:</p>
            <p className="text-lg font-semibold">{calculateTotalQuantity()}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-lg font-semibold">Total Price:</p>
            <p className="text-lg font-semibold">
              {formatRupiah(calculateTotalPrice())}
            </p>
          </div>
        </div>
      )}
      {cartData.length === 0 && (
        <div className="mt-8 mx-4 border-t border-gray-200 pt-4">
          <p className="text-center mt-16 text-gray-900 text-3xl font-bold">
            Your cart is empty
          </p>
          <div className="flex justify-center w-48 items-center mx-auto">
            <Button
              className="mx-auto mt-8 bg-gradient-to-r from-red-700 to-red-500 text-white"
              onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </main>
    </>
  );
}

export default Cart;
