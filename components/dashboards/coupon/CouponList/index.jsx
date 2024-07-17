import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useTheme } from "next-themes";

const CouponList = ({ coupons, onEdit, onDelete }) => {
  const { resolvedTheme } = useTheme();

  const containerBgColor = resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-gray-700";
  const subTextColor = resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500";
  const hoverEditColor = resolvedTheme === "dark" ? "hover:text-blue-400" : "hover:text-blue-800";
  const hoverDeleteColor = resolvedTheme === "dark" ? "hover:text-red-400" : "hover:text-red-800";

  return (
    <div className="mt-8">
      {coupons.map((coupon) => (
        <div
          key={coupon.id}
          className={`flex items-center justify-between p-4 ${containerBgColor} shadow rounded-lg mb-4`}>
          <div>
            <h2 className={`text-2xl font-semibold ${textColor}`}>{coupon.code}</h2>
            <p className={textColor}>
              {coupon.discountType}: {coupon.decimalValue || coupon.percentValue}
            </p>
            <p className={subTextColor}>
              Kadaluarsa: {new Date(coupon.expiration).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onEdit(coupon)}
              className={`text-blue-600 ${hoverEditColor}`}>
              <FiEdit size={24} />
            </button>
            <button
              onClick={() => onDelete(coupon.id)}
              className={`text-red-600 ${hoverDeleteColor}`}>
              <FiTrash size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CouponList;
