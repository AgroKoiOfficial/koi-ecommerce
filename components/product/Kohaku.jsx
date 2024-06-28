import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/utils/currency";

const Kohaku = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/products/byCategory?category=kohaku"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1, md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  style={{
                    objectFit: "contain",
                    height: "100%",
                    width: "auto",
                    marginInline: "auto",
                  }}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                <p className="text-gray-600">{formatRupiah(product.price)}</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default Kohaku;