import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/utils/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RelatedProducts = ({ relatedProducts }) => {
  return (
    <section aria-labelledby="related-products" className="mt-12">
      <header>
        <h2 id="related-products" className="text-2xl font-bold mb-4">
          Produk Terkait
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <Card
              key={product.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${product.slug}`} passHref>
                <CardHeader>
                  <div className="relative w-full h-48 mb-4">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        priority
                        className="rounded-md"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-200">
                        <span className="text-md text-gray-600">
                          Gambar Tidak Tersedia
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-semibold mb-2 truncate">
                    {product.name}
                  </CardTitle>
                  <p className="text-md">{formatRupiah(product.price)}</p>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">Tidak ada produk terkait</p>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
