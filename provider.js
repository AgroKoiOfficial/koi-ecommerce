import React from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
function Provider({ children }) {
  const { pathname } = useRouter();
  const disableNavbar = ['register', 'login', 'dashboard', 'user'];
  const disableFooter = ['register', 'login', 'dashboard', 'user'];

  return (
    <SessionProvider>
      {!disableNavbar.includes(pathname.split('/')[1]) && <Navbar />}
      {children}
      {!disableFooter.includes(pathname.split('/')[1]) && <Footer />}
    </SessionProvider>
  );
}

export default Provider;
