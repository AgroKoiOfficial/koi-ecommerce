import React from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
function Provider({ children }) {
  const { pathname } = useRouter();
  const disableNavbar = ['register', 'login', 'dashboard', 'user'];

  return (
    <SessionProvider>
      {!disableNavbar.includes(pathname.split('/')[1]) && <Navbar />}
      {children}
    </SessionProvider>
  );
}

export default Provider;
