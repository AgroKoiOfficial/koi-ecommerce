import React from "react";

const ProductMedia = ({ product }) => {
  return (
    <div className="lg:w-1/2 lg:mx-auto lg:text-center">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-auto h-96 object-contain mb-4 mx-auto"
        />
      )}
      {product.video && (
        <video
          src={product.video}
          controls
          className="w-full h-auto mt-4 lg:mt-4"
        ></video>
      )}
    </div>
  );
};

export default ProductMedia;
