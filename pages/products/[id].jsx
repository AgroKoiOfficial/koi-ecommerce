import React, { useState, useEffect } from "react";
import Head from "next/head";
import { formatRupiah } from "@/utils/currency";
import LoadingCard from "@/components/product/LoadingCard";

 const ProductDetail = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setIsLoading(false);
    }
  }, [product]);

  if (isLoading) {
    return (
      <main className="pt-16 lg:pt-20 mb-16 lg:mb-20">
        <div className="container mx-auto px-4">
          <LoadingCard />
        </div>
      </main>
    );
  }

  if (!product) {
    return <p className="text-center">Product not found.</p>;
  }

  return (
    <>
      <Head>
        <title>{product.name} - Product Detail</title>
        <meta name="description" content={`Detail of ${product.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="pt-16 lg:pt-20 mb-16 lg:mb-20">
        <div className="container mx-auto px-4 pt-16">
          <div className="flex flex-col lg:flex-row">
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
                  className="w-full h-auto mt-4 lg:mt-4"></video>
              )}
            </div>

            <div className="lg:w-1/2 lg:pl-8 mt-4">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-xl mb-4">
                Price: {formatRupiah(product.price)}
              </p>
              <p className="mb-4">Category: {product.category}</p>
              <p className="mb-4">Stock: {product.stock}</p>
              <div
                className="mb-4 overflow-y-auto"
                style={{ maxHeight: "200px" }}>
                {product.description}
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps({ params }) {
    const res = await fetch(`${process.env.PRODUCTS_URL}/${params.id}`);
    const product = await res.json();
  
    if (!res.ok) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: { product },
    };
  }
  
export default ProductDetail;