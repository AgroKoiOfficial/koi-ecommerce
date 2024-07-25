import React from "react";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductCard({ product, isLoading }) {
  const { theme } = useTheme();

  return (
    <Card className={`h-[100%] min-w-[50%] relative rounded-lg shadow-md overflow-hidden py-4 m-4 md:m-0 ${isLoading ? "animate-pulse" : ""}`}>
      <div className="relative overflow-hidden h-72 w-full">
        {isLoading ? (
          <div className="bg-gray-200 w-full h-full"></div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            priority={true}
            width={100}
            height={100}
            style={{
              objectFit: "contain",
              height: "100%",
              width: "auto",
              marginInline: "auto",
              animation: "ease-in"
            }}
            className="absolute inset-0"
          />
        )}
      </div>
      <CardContent className="p-1 flex flex-col items-center">
        <CardHeader>
          <CardTitle className={`text-2xl md:text-xl font-bold mb-1 truncate`}>
            {isLoading ? "Loading..." : product.name}
          </CardTitle>
        </CardHeader>
        <CardDescription className={`text-base md:text-lg mb-2`}>
          {isLoading ? "Loading..." : formatRupiah(product.price)}
        </CardDescription>
        <CardDescription className={`text-base md:text-lg mb-2`}>
          Stok: {isLoading ? "Loading..." : product.stock}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
