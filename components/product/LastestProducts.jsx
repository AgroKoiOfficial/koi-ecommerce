import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/utils/currency";

function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full md:w-1/2 lg:w-1/4">
      <div className="w-full h-64 lg:h-72 relative bg-gray-200 animate-pulse rounded-lg">
        <div className="w-full h-full bg-gray-300"></div>
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="bg-gray-300 h-6 w-2/3 mb-2 animate-pulse"></div>
        <div className="bg-gray-300 h-6 w-1/3 animate-pulse"></div>
      </div>
    </div>
  );
}

const LatestProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getTime");
        const data = await response.json();
        setProducts(data.latestProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="w-full">
        <LoadingCard />
        </div>
        <div className="w-full">
        <LoadingCard />
        </div>
        <div className="w-full">
        <LoadingCard />
        </div>
        <div className="w-full">
        <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link href={`/products/${product.slug}`} key={product.id} passHref>
          <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
            <div className="w-full h-64 lg:h-72 relative">
              <Image
                src={product.image}
                alt={product.name}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                width={100}
                height={100}
                style={{ objectFit: "contain", height: "100%", width: "auto", marginInline: "auto" }}
                className="w-full h-full"
              />
            </div>
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-md lg:text-lg font-bold">{product.name}</h3>
              <p className="text-gray-700 text-md">
                {formatRupiah(product.price)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LatestProducts;
