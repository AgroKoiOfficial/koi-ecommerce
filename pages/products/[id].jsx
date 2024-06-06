import React, { useState, useEffect } from "react";
import Head from "next/head";
import { formatRupiah } from "@/utils/currency";
import LoadingCard from "@/components/product/LoadingCard";
import GetReview from "@/components/dashboards/review/GetReview";
import { CreateReview } from "@/components/dashboards/review/CreateReview";

const ProductDetail = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("getReviews");

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
                  className="w-full h-auto mt-4 lg:mt-4"
                ></video>
              )}
            </div>

            <div className="lg:w-1/2 lg:pl-8 mt-4">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">
                {product.name}
              </h1>
              <p className=" lg:text-lg mb-4">
                <span className="font-bold">Price:</span>{" "}
                {formatRupiah(product.price)}
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
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to Cart
              </button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="flex mb-4">
              <button
                className={`mr-4 px-4 py-2 rounded ${
                  activeTab === "getReviews"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("getReviews")}
              >
                View Reviews
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "createReview"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("createReview")}
              >
                Write a Review
              </button>
            </div>
            <div className="flex flex-col ">
              <div className="w-full lg:pr-4">
                {activeTab === "getReviews" && (
                  <GetReview productId={product.id} />
                )}
              </div>
              <div className="w-full lg:w-1/2 lg:pl-4 mt-4 lg:mt-0">
                {activeTab === "createReview" && (
                  <CreateReview productId={product.id} />
                )}
              </div>
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
