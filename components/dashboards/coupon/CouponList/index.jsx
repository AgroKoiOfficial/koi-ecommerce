import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const CouponList = ({ coupons, onEdit, onDelete }) => {
  return (
    <div className="mt-8">
      {coupons.map((coupon) => (
        <div
          key={coupon.id}
          className="flex items-center justify-between p-4 bg-gray-100 shadow rounded-lg mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{coupon.code}</h2>
            <p className="text-gray-700">
              {coupon.discountType}:{" "}
              {coupon.decimalValue || coupon.percentValue}
            </p>
            <p className="text-gray-500">
              Expires: {new Date(coupon.expiration).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onEdit(coupon)}
              className="text-blue-600 hover:text-blue-800">
              <FiEdit size={24} />
            </button>
            <button
              onClick={() => onDelete(coupon.id)}
              className="text-red-600 hover:text-red-800">
              <FiTrash size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CouponList;
