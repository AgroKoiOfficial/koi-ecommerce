import React from "react";
import Head from "next/head";
import Image from "next/image";
import CompanyContact from "@/components/CompanyContact";

export async function getServerSideProps() {
  const response = await fetch(`${process.env.BASE_URL}/api/abouts`);
  const data = await response.json();

  if (!data || data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data[0],
    },
  };
}

export default function Abouts({ data }) {
  const paragraphs = data.content.split("\n").map((paragraph, index) => (
    <p key={index} className="mt-4 text-lg lg:text-xl text-gray-900">
      {paragraph}
    </p>
  ));

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.content} />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50 pt-20">
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 lg:p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">{data.title}</h1>
          {data.image && (
            <div className="w-full flex justify-center">
              <Image
                src={data.image}
                alt={data.title}
                width={500}
                height={500}
                priority={true}
                className="w-full lg:w-1/2 h-auto object-contain rounded-lg shadow-lg mt-4"
              />
            </div>
          )}
          <div className="mt-6">{paragraphs}</div>
          <CompanyContact />
        </div>
      </main>
    </>
  );
}
