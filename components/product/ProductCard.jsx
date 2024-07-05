import React from "react";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";

export default function ProductCard({ product, isLoading }) {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden py-4 m-4 md:m-0 ${
        isLoading ? "animate-pulse" : ""
      }`}>
      <div className="relative overflow-hidden h-72 w-full">
        {isLoading ? (
          <div className="bg-gray-200 w-full h-full"></div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            priority={true}
            width={100}
            height={100}
            style={{
              objectFit: "contain",
              height: "100%",
              width: "auto",
              marginInline: "auto",
              animation: "ease-in"
            }}
            className="absolute inset-0"
          />
        )}
      </div>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-xl font-bold mb-2 text-gray-800 truncate">
          {isLoading ? "Loading..." : product.name}
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-2">
          {isLoading ? "Loading..." : formatRupiah(product.price)}
        </p>
        <p className="text-base md:text-lg text-gray-700 mb-2">
          Stok: {isLoading ? "Loading..." : product.stock}
        </p>
      </div>
    </div>
  );
}
