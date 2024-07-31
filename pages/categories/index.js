import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { formatRupiah } from "@/utils/currency";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export async function getServerSideProps() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/byCategory`
    );
    const data = await response.json();

    const productsWithUrl = data.productsWithUrl || [];
    const displayedCategories = data.displayedCategories || [];

    return {
      props: {
        productsWithUrl,
        displayedCategories,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        productsWithUrl: [],
        displayedCategories: [],
      },
    };
  }
}

export default function Categories({ productsWithUrl, displayedCategories }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    if (displayedCategories.length > 0) {
      setSelectedCategory(displayedCategories[0]);
    }

    setFilteredProducts(
      productsWithUrl.filter(
        (product) => product.category === displayedCategories[0]
      )
    );
  }, [productsWithUrl, displayedCategories]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        productsWithUrl.filter(
          (product) =>
            product.category === selectedCategory &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, selectedCategory, productsWithUrl]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(
      productsWithUrl.filter(
        (product) =>
          product.category === categoryName &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <>
      <Head>
        <title>Categories</title>
        <meta
          name="description"
          content="Categories, Jual Ikan Koi Berbagai Macam Jenis, dan Berkualitas, Agro Koi, Kohaku, Ikan Koi, Ikan"
          key="description"
        />
      </Head>

      <main className="container min-h-screen mx-auto py-8 pt-8">
        <Input
          type="text"
          placeholder="cari produk ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="relative mt-4">
          <ScrollArea>
            <div className="categories-scroll">
              {displayedCategories.length > 0 ? (
                displayedCategories.map((category) => (
                  <div
                    key={category}
                    className={`category-box p-1 rounded-md cursor-pointer ${
                      selectedCategory === category
                        ? "border-2 border-red-500"
                        : ""
                    } ${
                      theme === "dark"
                        ? "shadow-md shadow-gray-700"
                        : "shadow-md shadow-gray-300"
                    }`}
                    onClick={() => handleCategorySelect(category)}>
                    <h4 className="text-sm lg:text-lg text-center">
                      {category}
                    </h4>
                  </div>
                ))
              ) : (
                <p
                  className={`text-center ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}>
                  No categories found.
                </p>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        {selectedCategory && (
          <div className="mt-8">
            <h2
              className={`text-2xl text-center font-bold mb-4 lg:mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}>
              Produk {selectedCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <Card
                    key={product.id}
                    className={`p-4 rounded-md shadow-md ${
                      theme === "dark"
                        ? "text-gray-300 shadow-gray-700"
                        : "text-gray-800 shadow-gray-300"
                    }`}>
                    <CardHeader>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={100}
                        priority={true}
                        style={{ objectFit: "contain" }}
                        className="h-72 w-full mx-auto"
                      />
                    </CardHeader>
                    <CardContent className="mt-4 flex flex-col items-center space-y-1">
                      <CardTitle className="text-md lg:text-lg font-semibold">
                        {product.name}
                      </CardTitle>
                      <p className="text-[.9rem] lg:text-md">
                        Harga: {product.price}
                      </p>
                      <p className="text-[0.7rem] lg:text-md">
                        Stok: {product.stock}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .categories-scroll {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
        }

        .category-box {
          flex: 0 0 120px;
          text-align: center;
        }
      `}</style>
    </>
  );
}
