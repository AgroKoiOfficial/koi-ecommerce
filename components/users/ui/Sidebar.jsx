import React from "react";
import { useRouter } from "next/router";
import { FiX, FiHome, FiShoppingCart, FiList } from "react-icons/fi";
import { FaShippingFast, FaRegUser, FaUser , FaRegAddressCard  } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";
import { CiShop, CiShoppingCart } from "react-icons/ci";
import { MdOutlineRateReview, MdOutlineShoppingCartCheckout  } from "react-icons/md";
import { Button } from "../../ui/Button";
import MenuItem from "./MenuItem";

const Sidebar = ({ isSidebar, toggleSidebar, toggleCloseSidebar }) => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };
  return (
    <div
      className={`${
        isSidebar ? "w-64" : "hidden lg:block w-64"
      } fixed inset-y-0 left-0 z-40 transition-width duration-200 ease-in-out bg-gray-900 text-white shadow-lg`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="ml-2 text-xl font-bold">Agro</span>
          </div>
          {/* Close Button */}
          <button
            className="text-gray-300 hover:text-white focus:outline-none lg:hidden"
            onClick={toggleCloseSidebar}>
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <MenuItem
              icon={<FiHome className="h-5 w-5 mr-2" />}
              title="Dashboard"
              href="#"
              submenu={[
                { title: "Submenu Item 1", href: "#", icon: null },
                {
                  title: "Review History",
                  href: "/user/review",
                  icon: <MdOutlineRateReview className="h-5 w-5 mr-2" />,
                },
              ]}
            />
            <MenuItem
              icon={<FiList className="h-5 w-5 mr-2" />}
              title="Orders"
              href="#"
              submenu={[
                { title: "Checkout History", href: "/user/checkout-history", icon: <MdOutlineShoppingCartCheckout className="h-5 w-5 mr-2" /> },
                { title: "Submenu Item 2", href: "#", icon: null },
              ]}
            />
            <MenuItem
            icon={<FaRegUser  className="h-5 w-5 mr-2" />}
            title={'User Management'}
            href={'#'}
            submenu={[
              { title: " User Info", href: "/user/user-management", icon: <FaUser className="h-5 w-5 mr-2"/> },
              { title: "Address", href: "/user/address", icon: <FaRegAddressCard className="h-5 w-5 mr-2"/> },
            ]}
            />
          </ul>
          <div className="w-[40%] md:w-auto flex  flex-1 items-center justify-center bottom-0 fixed m-8">
            <Button
              className="bg-white  hover:bg-gray-100 text-gray-900 font-semibold"
              onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
