import React from 'react';
import Head from 'next/head';
import { FiCheckCircle } from 'react-icons/fi';

export default function Terms({ terms }) {
  const descriptionContent = terms.map(term => term.content).join(' ');

  return (
    <>
      <Head>
        <title>Ketentuan Layanan - Koi Toko</title>
        <meta
          name="description"
          content={descriptionContent}
        />
      </Head>
      <main className="flex flex-col items-center justify-start pt-24 min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Ketentuan Layanan</h1>
        <div className="w-full max-w-6xl px-4">
          {terms.length > 0 ? (
            terms.map(term => (
              <article key={term.id} className="mb-4 p-6 bg-white rounded-lg shadow-md">
                <header className="flex items-center mb-4">
                  <FiCheckCircle className="text-green-500 mr-2" size={24} />
                  <h2 className="text-2xl font-semibold">{term.title}</h2>
                </header>
                <section className="text-lg text-gray-700">
                  {term.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </section>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada ketentuan dan persyaratan yang tersedia.</p>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/term_conditions`);
  const data = await res.json();

  return {
    props: {
      terms: data.terms || [],
    },
  };
}
