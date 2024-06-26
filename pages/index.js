import React from "react";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import LastestProducts from "@/components/product/LastestProducts";
import { Inter } from "next/font/google";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/carousel`);
  if (!res.ok) {
    throw new Error("Failed to fetch carousels");
  }
  const carousels = await res.json();

  return {
    props: {
      carousels,
    },
    revalidate: 120,
  };
}

export default function Home({ carousels }) {
  return (
    <>
      <main className="flex flex-col justify-center items-center pt-16 mb-20">
        <Carousel carousels={carousels} />
        <div className="mt-4 lg:mt-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">Produk Terbaru</h1>
          <LastestProducts />
        </div>
      </main>
      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}
