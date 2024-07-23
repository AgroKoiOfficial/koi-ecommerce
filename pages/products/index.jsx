import  { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import ProductCard from "../../components/product/ProductCard";
import { CTA } from "@/components/CTA";
import dynamic from "next/dynamic";
import { useTheme } from 'next-themes';
import SearchResults from "@/components/SearchResults";

const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), { ssr: false });

const GoogleTagManager = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleTagManager), { ssr: false });

const perPage = 10;

export default function Products({ products, totalProducts }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasMore, setHasMore] = useState(totalProducts > products.length);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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
      `${process.env.NEXT_PUBLIC_API_URL}?page=${nextPage}&limit=${perPage}&search=${searchTerm}`
    );

    if (response.ok) {
      const newData = await response.json();
      setAllProducts([...allProducts, ...newData]);
      setPage(nextPage);
      
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
        setSearchResults([]);
        setIsSearching(false);
      } else {
        performSearch(value);
      }
    }, 500));
  };

  const performSearch = async (term) => {
    setIsSearching(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?search=${term}&page=1&limit=${perPage}`);

    if (response.ok) {
      const searchData = await response.json();
      setSearchResults(searchData);
      setIsSearching(false);
      setAllProducts(searchData);
      setHasMore(searchData.length === perPage);
    } else {
      setIsSearching(false);
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
        <div className="relative flex justify-center mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            className={`px-4 py-2 w-1/2 rounded-md ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800"} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {isSearching && <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10 p-2">Loading...</div>}
          {!isSearching && searchResults.length > 0 && <SearchResults results={searchResults} />}
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
      <GoogleTagManager gtmId="GTM-8280730251" />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?page=1&limit=10`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    
    const productsData = await response.json();
    const totalProducts = parseInt(response.headers.get("X-Total-Count"), 10);

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
