import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = ctx.res?.getHeader('X-Nonce');
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;
    return (
      <Html lang="id">
        <Head>
          <meta name="theme-color" content="#ffffff" />
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content="Jual Ikan Koi Berbagai Macam Jenis, dan Berkualitas" />
          <meta name="keywords" content="kohaku, ikan, koi, ikan koi" />
          <meta name="author" content="Agro Koi" />
          <link rel="icon" href="/logo.png" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <meta property="og:title" content="Koi Toko" />
          <meta property="og:description" content="Kami menjual Ikan Koi Berkualitas" />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:url" content="https://trioagus.cloud" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Your Website Title" />
          <meta name="twitter:description" content="Kami menjual Ikan Koi Berkualitas" />
          <meta name="twitter:image" content="/logo.png" />
          <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `console.log('Nonce added to script');` }} />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
