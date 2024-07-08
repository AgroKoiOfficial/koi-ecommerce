import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import LastestProducts from "@/components/product/LastestProducts";
import { Inter } from "next/font/google";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

const Services = dynamic(() => import("@/components/Services"), { ssr: true });

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/carousel`);
    if (!res.ok) {
      throw new Error(`Failed to fetch carousels, status: ${res.status}`);
    }
    const carousels = await res.json();

    return {
      props: {
        carousels,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error("Error fetching carousels:", error.message);
    return {
      props: {
        carousels: [],
      },
    };
  }
}

export default function Home({ carousels }) {
  return (
    <>
      <Head>
        <title>Koi Toko</title>
        <meta
          name="description"
          content="Koi Toko, Jual Ikan Koi, Berkualitas"
        />
      </Head>
      <main className="flex flex-col min-h-svh justify-center items-center pt-16 mb-20">
        <Carousel carousels={carousels} />
        <div className="mt-4 lg:mt-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 lg:mb-8">Produk Terbaru</h1>
          <LastestProducts />
        </div>
        <Services />
      </main>
      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}
