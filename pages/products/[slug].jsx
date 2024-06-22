import React, { useState, useEffect } from "react";
import Head from "next/head";
import LoadingCard from "@/components/product/LoadingCard";
import ProductInfo from "@/components/product/ProductInfo";
import ProductMedia from "@/components/product/ProductMedia";
import ProductReviews from "@/components/product/ProductReviews";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slug/${slug}`);
  
    if (!res.ok) {
      console.error(`Failed to fetch product with slug ${slug}: ${res.statusText}`);
      return {
        notFound: true,
      };
    }

    const product = await res.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return {
      notFound: true,
    };
  }
}

function ProductDetail({ product }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  if (loading) {
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
}

export default ProductDetail;
