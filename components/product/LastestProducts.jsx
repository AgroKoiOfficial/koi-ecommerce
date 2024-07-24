import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/utils/currency";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/getTime");
        const data = await response.json();
        setProducts(data.latestProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cardBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const cardTextClass = theme === "dark" ? "text-white" : "text-gray-800";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : products.map((product, index) => (
            <Link href={`/products/${product.slug}`} key={product.id} passHref>
              <Card className={`rounded-lg shadow-lg p-4 ${cardBgClass} ${cardTextClass}`}>
                <div className="w-full h-64 lg:h-72 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    width={100}
                    height={100}
                    style={{ objectFit: "contain", height: "100%", width: "auto", marginInline: "auto" }}
                    className="w-full h-full"
                  />
                </div>
                <CardContent className="p-2 flex flex-col items-center">
                  <CardHeader>
                    <CardTitle className="text-md lg:text-lg font-bold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardDescription className="text-md font-semibold">
                    {formatRupiah(product.price)}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
    </div>
  );
};

export default LatestProducts;
