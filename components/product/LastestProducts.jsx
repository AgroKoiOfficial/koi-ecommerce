import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/utils/currency";
import { useTheme } from "next-themes";

const Skeleton = () => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-lg animate-pulse">
    <div className="w-full h-64 lg:h-72 bg-gray-300 rounded"></div>
    <div className="p-4 flex flex-col items-center">
      <div className="mb-2 h-4 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getTime");
        const data = await response.json();
        setProducts(data.latestProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cardBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardTextClass = theme === "dark" ? "text-white" : "text-gray-800";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <Skeleton />
            </div>
          ))
        : products.map((product, index) => (
            <Link href={`/products/${product.slug}`} key={product.id} passHref>
              <div className={`rounded-lg shadow-lg p-4 ${cardBgClass} ${cardTextClass}`}>
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
                  <p className=" text-md">
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