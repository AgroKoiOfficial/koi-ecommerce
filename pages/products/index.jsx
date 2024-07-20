import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import ProductCard from "../../components/product/ProductCard";
import { CTA } from "@/components/CTA";
import dynamic from "next/dynamic";
import { useTheme } from 'next-themes';

const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), { ssr: false });

export default function Products({ products, totalProducts }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasMore, setHasMore] = useState(totalProducts > products.length);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    setIsLoadingData(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allProducts, hasMore]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    loadMore();
  };

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}?page=${nextPage}&search=${searchTerm}`
    );

    if (response.ok) {
      const newData = await response.json();
      setAllProducts([...allProducts, ...newData]);
      setPage(nextPage);

      // Determine if there's more data to load
      if (newData.length < perPage) {
        setHasMore(false);
      }
    } else {
      setHasMore(false); 
    }
    
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(setTimeout(() => {
      if (value.trim() === '') {
        setSearchTerm('');
        setAllProducts(products);
        setHasMore(totalProducts > products.length);
        setPage(1);
      } else {
        performSearch(value);
      }
    }, 500));
  };

  const performSearch = async (term) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?search=${term}&page=1`);

    if (response.ok) {
      const searchData = await response.json();
      setAllProducts(searchData);
      setHasMore(searchData.length === perPage); // Check if there might be more data
    }
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
      <main className="pt-8 mb-16 lg:mb-20">
        <h1 className={`text-3xl lg:text-4xl font-bold mb-8 text-center my-4 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
          Produk
        </h1>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            className={`px-4 py-2 w-1/2 rounded-md ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800"} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
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
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        <CTA />
      </main>

      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
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
