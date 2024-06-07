import React, { useState, useEffect } from "react";
import Head from "next/head";
import LoadingCard from "@/components/product/LoadingCard";
import ProductInfo from "@/components/product/ProductInfo";
import ProductMedia from "@/components/product/ProductMedia";
import ProductReviews from "@/components/product/ProductReviews";

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
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <ProductMedia product={product} />
            <div className="lg:w-1/2 mt-4 lg:mt-0">
              <ProductInfo product={product} />
              <ProductReviews productId={product.id} />
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
