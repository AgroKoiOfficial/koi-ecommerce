import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from '@/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@/components/theme-provider"
// import dynamic from "next/dynamic";

// const GoogleTagManager = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleTagManager), { ssr: false });
// const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), { ssr: false });

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <Provider>
        <Component {...pageProps} />
        {/* <GoogleTagManager gtmId="GTM-8280730251"/> */}
        {/* <GoogleAnalytics gaId="G-BKXLWYCWM3" /> */}
        <ToastContainer position="top-center" />
      </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}

