import React from "react";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";

const ProductInfo = ({ product }) => {
  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">
        {product.name}
      </h1>
      <p className="lg:text-lg mb-4">
        <span className="font-bold">Price:</span> {formatRupiah(product.price)}
      </p>
      <p className="mb-4">
        <span className="font-bold">Category:</span> {product.category}
      </p>
      <p className="mb-4">
        <span className="font-bold">Stock:</span> {product.stock}
      </p>
      <div className="mb-4">
        <span className="font-bold">Description:</span>
        <p className="mt-2">{product.description}</p>
      </div>
      <div className="mb-4 md:w-1/5">
        <Button className="bg-blue-500 hover:bg-blue-700 text-white">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
