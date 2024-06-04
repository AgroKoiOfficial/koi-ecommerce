import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isNavbar, setIsNavbar] = useState(false);
  const [session, setSession] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className={`fixed w-full z-10 bg-white shadow-md border-spacing-3 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {session ? (
                  <>
                    {session.user.isAdmin ? (
                      <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                    ) : (
                      <a href="/user" className="px-3 py-2 rounded-md text-sm font-medium">User</a>
                    )}
                  </>
                ) : (
                  <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium">Login</a>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session && (
                <button onClick={handleLogout} className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleSidebar} className="bg-white text-gray-900 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
             {isSidebarOpen ? <FiX className="h-6 w-6"/> : <FiMenu className="h-6 w-6"/>}
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {session ? (
              <>
                {session.user.isAdmin ? (
                  <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Dashboard</a>
                ) : (
                  <a href="/user" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">User</a>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Logout</button>
              </>
            ) : (
              <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Login</a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
