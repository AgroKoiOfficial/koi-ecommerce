import "@/styles/globals.css";
import { GoogleTagManager, GoogleAnalytics} from '@next/third-parties/google'
import { SessionProvider } from "next-auth/react";
import Provider from '@/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider>
        <Component {...pageProps} />
        <GoogleTagManager gtmId="GTM-8280730251"/>
        <GoogleAnalytics gaId="G-BKXLWYCWM3" />
        <ToastContainer position="top-center" />
      </Provider>
    </SessionProvider>
  );
}

