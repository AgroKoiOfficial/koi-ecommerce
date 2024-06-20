import { useState, useEffect, useRef } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export const useNavbar = () => {
  const [isNavbar, setIsNavbar] = useState(false);
  const [session, setSession] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userCart, setUserCart] = useState(null);
  const router = useRouter();
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const session = await getSession();
        if (session && session.user) {
          const userId = session.user.id;
          const response = await fetch(`/api/cart/userId/${userId}`);
          const data = await response.json();
          setUserCart(data);
        }
      } catch (error) {
        console.error("Failed to fetch user cart:", error);
      }
    };

    fetchUserCart();
  }, [session]);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return {
    isNavbar,
    session,
    isSidebarOpen,
    isDropdownOpen,
    dropdownRef,
    handleLogout,
    toggleSidebar,
    toggleDropdown,
    userCart
  };
};


