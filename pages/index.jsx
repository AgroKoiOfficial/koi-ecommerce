import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import LastestProducts from "@/components/product/LastestProducts";
import { CTA } from "@/components/CTA";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

const Services = dynamic(() => import("@/components/Services"), { ssr: true });

const Skeleton = () => (
  <div className="bg-gray-200 p-4 rounded animate-pulse">
    <div className="mb-2 h-4 bg-gray-300 rounded"></div>
    <div className="h-12 bg-gray-300 rounded"></div>
    <div className="h-12 bg-gray-300 rounded"></div>
  </div>
);

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
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServicesLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Koi Toko</title>
        <meta
          name="description"
          content="Koi Toko, Jual Ikan Koi, Berkualitas"
        />
      </Head>
      <main className="flex flex-col justify-center items-center mb-20">
        <Carousel carousels={carousels} />
        <div className="mt-4 lg:mt-8 min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 lg:mb-8">Produk Terbaru</h1>
          <LastestProducts />
        </div>
        <div className="mt-4 lg:mt-8 min-h-screen flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4 lg:mb-8">Layanan Kami</h2>
          {servicesLoaded ? <Services /> : <Skeleton />}
        </div>
        <CTA />
      </main>
      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}
