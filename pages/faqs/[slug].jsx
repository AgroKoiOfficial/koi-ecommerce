import React from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(`${process.env.BASE_URL}/api/faqs/${slug}`);
    const faq = await res.json();

    if (!faq || res.status !== 200) {
      return { notFound: true };
    }

    return { props: { faq } };
  } catch (error) {
    console.error("Error fetching FAQ:", error.message);
    return { notFound: true };
  }
}

function FaqDetail({ faq }) {
  const { theme } = useTheme();

  if (!faq) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{faq.question} - FAQs - Jual Ikan Koi</title>
        <meta name="description" content={faq.answer} />
      </Head>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 mb-16 lg:mb-20">
        <div className={`bg-${theme === "dark" ? "gray-800" : "white"} shadow-md rounded-lg p-6 mt-8`}>
          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbItem>
              <Link href="/faqs" passHref>
                <BreadcrumbLink>FAQs</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            &nbsp;/&nbsp;
            <BreadcrumbItem>
              <span className="capitalize">{faq.question}</span>
            </BreadcrumbItem>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mt-6 mb-4">{faq.question}</h1>
          <p className="text-md lg:text-lg">{faq.answer}</p>
        </div>
      </main>

      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}

export default FaqDetail;
