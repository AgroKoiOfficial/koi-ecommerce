import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";

function Provider({ children }) {
  const { pathname } = useRouter();
  const disableNavbar = ['register', 'login', 'reset-password', 'forgot-password', 'dashboard', 'user'];
  const disableFooter = ['register', 'login', 'reset-password', 'forgot-password', 'dashboard', 'user'];

  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    setIsContentLoaded(true);
  }, []);

  return (
    <>
      {!disableNavbar.includes(pathname.split('/')[1]) && <Navbar />}
      {children}
      {isContentLoaded && !disableFooter.includes(pathname.split('/')[1]) && <Footer />}
    </>
  );
}

export default Provider;
