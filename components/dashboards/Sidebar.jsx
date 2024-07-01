import React from "react";
import { useRouter } from "next/router";
import { FiX, FiHome, FiShoppingCart, FiList, FiUsers } from "react-icons/fi";
import { FaShippingFast, FaWhatsapp, FaQuestion, FaServicestack } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";
import { CiShop, CiShoppingCart } from "react-icons/ci";
import { RiCarouselView, RiPagesFill } from "react-icons/ri";
import { MdOutlineRateReview, MdOutlineDiscount, MdOutlineContactMail} from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { Button } from "../ui/Button";
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
                { title: "Google Analytics", href: "/dashboard/analytics", icon: <SiGoogleanalytics className="h-5 w-5 mr-2" /> || null },
                { title: "Checkout Analytics", href: "/dashboard/checkout", icon: <IoBagCheckOutline className="h-5 w-5 mr-2" /> || null },
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
                {
                  title: "Cart",
                  href: "/dashboard/cart",
                  icon: <CiShoppingCart className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Shipping",
                  href: "/dashboard/shipping",
                  icon: <FaShippingFast className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Discount",
                  href: "/dashboard/discount",
                  icon: <MdOutlineDiscount className="h-5 w-5 mr-2" />,
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
                {
                  title: "Checkout History",
                  href: "/dashboard/checkout-history",
                  icon: <IoBagCheckOutline className="h-5 w-5 mr-2" />,
                },
              ]}
            />
            <MenuItem
              icon={<FiList className="h-5 w-5 mr-2" />}
              title="About"
              href="#"
              submenu={[
                {
                  title: "Page",
                  href: "/dashboard/abouts",
                  icon: <RiPagesFill className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Contact",
                  href: "/dashboard/contacts",
                  icon: <MdOutlineContactMail className="h-5 w-5 mr-2" />,
                }
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
                {
                  title: "Whatsapp CTA",
                  href: "/dashboard/cta",
                  icon: <FaWhatsapp className="h-5 w-5 mr-2" />,
                },
                {
                  title: "FAQ",
                  href: "/dashboard/faqs",
                  icon: <FaQuestion className="h-5 w-5 mr-2" />,
                },
                {
                  title: "Service",
                  href: "/dashboard/services",
                  icon: <FaServicestack className="h-5 w-5 mr-2" />,
                }
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
