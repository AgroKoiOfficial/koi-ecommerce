import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Search } from "@/components/ui/Search";
import { Pagination } from "@/components/ui/Pagination";
import FaqCard from "@/components/FaqCard";
import dynamic from "next/dynamic";
import { useTheme } from 'next-themes';

const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), { ssr: false });

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/faqs`);
    const data = await res.json();

    console.log("Data from API:", data);

    if (!data || !Array.isArray(data)) {
      throw new Error("Failed to fetch FAQs");
    }

    const categories = Array.from(new Set(data.map((faq) => faq.category)));

    return {
      props: {
        initialFaqs: data || [],
        totalFaqs: parseInt(res.headers.get("X-Total-Count")) || 0,
        categories: categories || [],
      },
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error.message);
    return {
      props: {
        initialFaqs: [],
        totalFaqs: 0,
        categories: [],
      },
    };
  }
}

export default function Faqs({ initialFaqs, totalFaqs, categories }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredFaqs, setFilteredFaqs] = useState(initialFaqs || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    setFilteredFaqs(initialFaqs || []);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialFaqs]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    if (totalFaqs > filteredFaqs.length) {
      loadMore();
    }
  };

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/faqs?page=${nextPage}&search=${encodeURIComponent(
          searchTerm
        )}&category=${encodeURIComponent(selectedCategory)}`
      );
      const newData = await response.json();
      setFilteredFaqs((prevFaqs) => [...prevFaqs, ...newData]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    setPage(page);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/faqs?page=${page}&search=${encodeURIComponent(
          searchTerm
        )}&category=${encodeURIComponent(selectedCategory)}`
      );
      const newData = await response.json();
      setFilteredFaqs(newData);
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value) => {
    fetchFaqs(value);
  }, 300);

  const fetchFaqs = async (value) => {
    setSearchTerm(value);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/faqs?page=1&search=${encodeURIComponent(value)}&category=${encodeURIComponent(
          selectedCategory
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to search FAQs");
      }
      const searchData = await response.json();
      setFilteredFaqs(searchData);
      setPage(1);
    } catch (error) {
      console.error("Error searching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "") {
      setFilteredFaqs(initialFaqs);
    } else {
      const filtered = initialFaqs.filter((faq) => faq.category === category);
      setFilteredFaqs(filtered);
    }
    setPage(1);
  };

  return (
    <>
      <Head>
        <title>FAQs - Jual Ikan Koi</title>
        <meta
          name="description"
          content="Temukan berbagai pertanyaan yang sering diajukan oleh pelapak ikan koi. Kami menyediakan pertanyaan yang bermanfaat dan terkait ikan koi. Jelajahi FAQs kami sekarang!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className={`pt-16 lg:pt-20 mb-16 lg:mb-20 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center my-4">
            FAQs
          </h1>
          <div className="flex justify-center mb-6">
            <Search placeholder="Cari pertanyaanmu" onSearch={handleSearch} />
            <select
              className="ml-4 p-2 border border-gray-300 rounded"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory === "" && (
            <div className="felx flex-col w-full">
              {filteredFaqs.map((faq, index) => (
                <FaqCard key={index} faq={faq} />
              ))}
            </div>
          )}
          {selectedCategory !== "" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
              <div className="felx flex-col w-full">
                {filteredFaqs.map((faq, index) => (
                  <FaqCard key={index} faq={faq} />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalFaqs / 10)}
              onPageChange={handlePageChange}
            />
          </div>
          {loading && <p className="text-center mt-8">Loading...</p>}
        </div>
      </main>
      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}
