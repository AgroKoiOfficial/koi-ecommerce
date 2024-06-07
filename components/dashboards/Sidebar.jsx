import React from "react";
import { FiX, FiHome, FiShoppingCart, FiList, FiUsers } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { RiCarouselView } from "react-icons/ri";
import { MdOutlineRateReview } from "react-icons/md";
import MenuItem from "./MenuItem";

const Sidebar = ({ isSidebar, toggleSidebar, toggleCloseSidebar }) => {
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
                { title: "Submenu Item 2", href: "#", icon: null },
              ]}
            />
            <MenuItem
              icon={<FiShoppingCart className="h-5 w-5 mr-2" />}
              title="Ecommerce"
              href="#"
              submenu={[
                {
                  title: "Product",
                  href: "/dashboard/products",
                  icon: <CiShop className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Category",
                  href: "/dashboard/categories",
                  icon: <BiCategory className="h-5 w-5 mr-2" />,
                },
              ]}
            />
            <MenuItem
              icon={<FiUsers className="h-5 w-5 mr-2" />}
              title="Users"
              href="#"
              submenu={[
                {
                  title: "User",
                  href: "/dashboard/users",
                  icon: <FiUsers className="h-5 w-5 mr-2" />,
                },
              ]}
            />
            <MenuItem
              icon={<FiList className="h-5 w-5 mr-2" />}
              title="Orders"
              href="#"
              submenu={[
                { title: "Submenu Item 1", href: "#", icon: null },
                { title: "Submenu Item 2", href: "#", icon: null },
              ]}
            />
            <MenuItem
              icon={<CgWebsite className="h-5 w-5 mr-2" />}
              title="Content"
              href="#"
              submenu={[
                {
                  title: "Carousel",
                  href: "/dashboard/carousel",
                  icon: <RiCarouselView className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Product Review",
                  href: "/dashboard/review",
                  icon: <MdOutlineRateReview className="h-5 w-5 mr-2" />,
                },
              ]}
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
