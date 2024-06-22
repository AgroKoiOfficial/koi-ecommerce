import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import ProductCard from "../../components/product/ProductCard";
import { CTA } from "@/components/CTA";

export default function Products({ products, totalProducts }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setIsLoadingData(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    if (totalProducts > allProducts.length) {
      loadMore();
    }
  };

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}?page=${nextPage}`
    );

    if (response.ok) {
      const newData = await response.json();
      setAllProducts([...allProducts, ...newData]);
      setPage(nextPage);
      if (newData.length === 0) {
        setHasMore(false);
      }
    } else {
      console.error("Failed to load more products");
      setHasMore(false); 
    }
    
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Products - Jual Ikan Koi</title>
        <meta
          name="description"
          content="Temukan berbagai produk ikan koi berkualitas di toko kami. Kami menyediakan ikan koi dengan harga terjangkau dan kualitas terbaik. Jelajahi koleksi kami sekarang!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="pt-16 lg:pt-20 mb-16 lg:mb-20">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center my-4">
          Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {allProducts.map((product, index) => (
            <Link href={`/products/${product.slug}`} key={index}>
              <ProductCard
                key={index}
                product={product}
                isLoading={isLoadingData}
              />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {hasMore ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          ) : (
            <p className="text-center mt-8">You've reached the end of the list</p>
          )}
        </div>
        <CTA />
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );

  try {
    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?page=1`);
    
    if (!products.ok) {
      throw new Error("Failed to fetch products");
    }
    
    const productsData = await products.json();
    const totalProducts = parseInt(products.headers.get("X-Total-Count"), 10);

    return {
      props: {
        products: productsData,
        totalProducts,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      props: {
        products: [],
        totalProducts: 0,
      },
    };
  }
}
