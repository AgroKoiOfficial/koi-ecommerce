import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getTime");
        const data = await response.json();
        setProducts(data.latestProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
          <div className="w-full h-64 lg:h-72 relative">
            <Image
              src={product.image}
              alt={product.name}
              priority={true}
              width={100}
              height={100}
              style={{ objectFit: "contain", height: "auto", width: "auto", marginInline: "auto" }}
              className="w-full h-full"
            />
          </div>
          <div className="p-4 flex flex-col items-center">
          <h3 className="text-md lg:text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">{formatRupiah(product.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;
