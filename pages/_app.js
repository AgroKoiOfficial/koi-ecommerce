import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from '@/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider>
        <Component {...pageProps} />
        <ToastContainer position="top-center" />
      </Provider>
    </SessionProvider>
  );
}

