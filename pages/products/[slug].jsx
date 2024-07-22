import React, { useState, useEffect } from "react";
import Head from "next/head";
import ProductMedia from "@/components/product/ProductMedia";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import { CTA } from "@/components/CTA";
import RelatedProducts from "@/components/product/RelatedProducts";
import LoadingCard from "@/components/product/LoadingCard";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slug/${slug}`);

    if (!res.ok) {
      // console.error(`Failed to fetch product with slug ${slug}: ${res.statusText}`);
      return { notFound: true };
    }

    const product = await res.json();

    const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/related-products?productId=${product.id}`);
    const relatedProducts = relatedRes.ok ? await relatedRes.json() : [];

    return { props: { product, relatedProducts } };
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return { notFound: true };
  }
}

function ProductDetail({ product, relatedProducts }) {
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
        <meta name="description" content={`Detail of ${product.name} ${product.description}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="pt-16 lg:pt-20 mb-16 lg:mb-20">
        <div className="container mx-auto px-4 pt-16">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <ProductMedia product={product} />
            <div className="lg:w-1/2 mt-4 lg:mt-0 flex flex-col">
              <ProductInfo product={product} />
              <ProductReviews productId={product.id} />
              <RelatedProducts relatedProducts={relatedProducts} />
            </div>
          </div>
        </div>
        <CTA />
      </main>
      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}

export default ProductDetail;
