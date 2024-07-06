import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatRupiah } from "@/utils/currency";

export async function getServerSideProps() {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/products/byCategory`
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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(
      productsWithUrl.filter((product) => product.category === categoryName)
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

      <main className="container mx-auto py-8 pt-20">
        <h1 className="text-3xl text-center font-bold mt-8 mb-4">Categories</h1>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {displayedCategories.length > 0 ? (
            displayedCategories.map((category) => (
              <div
                key={category}
                className={`bg-white p-2 rounded-md shadow-md cursor-pointer ${
                  selectedCategory === category ? "border-2 border-red-500" : ""
                }`}
                onClick={() => handleCategorySelect(category)}>
                <h2 className="text-sm lg:text-lg text-center font-semibold">
                  {category}
                </h2>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
        {selectedCategory && (
          <div className="mt-8">
            <h2 className="text-2xl text-center font-bold mb-4">
              Produk {selectedCategory}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-md shadow-md">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      priority={true}
                      style={{
                        width: "auto",
                        height: "auto",
                        margin: "0 auto",
                      }}
                    />
                    <div className="mt-4 flex flex-col items-center space-y-1">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <p className="text-sm font-semibold">
                        Harga: {formatRupiah(product.price)}
                      </p>
                      <p className="text-sm">Stok: {product.stock}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
