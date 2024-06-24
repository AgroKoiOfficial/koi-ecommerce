import { Html, Head, Main, NextScript } from "next/document";
import { v4 as uuidv4 } from 'uuid';

export default function Document() {
  const nonce = uuidv4();

  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Jual Ikan Koi Berbagai Macam Jenis, dan Berkualitas" />
        <meta name="keywords" content="kohaku, ikan, koi, ikan koi" />
        <meta name="author" content="Agro Koi" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta property="og:title" content="Your Website Title" />
        <meta
          property="og:description"
          content="Your website description here"
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Website Title" />
        <meta
          name="twitter:description"
          content="Your website description here"
        />
        <meta name="twitter:image" content="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce}></NextScript>
      </body>
    </Html>
  );
}
