import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import Navbar from "@/components/dashboards/Navbar";
import Sidebar from "@/components/dashboards/Sidebar";

function AdminDashboard({ children, title }) {
  const [isNavbar, setIsNavbar] = useState(false);
  const [isSidebar, setIsSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsNavbar(true);
      } else {
        setIsNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebar(!isSidebar);
  };

  const toggleCloseSidebar = () => {
    setIsSidebar(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebar={isSidebar} toggleCloseSidebar={toggleCloseSidebar} />
      <div className="flex flex-col flex-1 w-0 md:pl-32 lg:pl-64 overflow-hidden">
        <Navbar
          isNavbar={isNavbar}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
