import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';
import { getSession } from 'next-auth/react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../api";
import CouponList from "../CouponList";
import CouponForm from "../CouponForm";

export const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [session, setSession] = useState(null);
  const [editCoupon, setEditCoupon] = useState(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    const fetchCoupons = async () => {
      const data = await getCoupons();
      setCoupons(data);
    };

    fetchSession();
    fetchCoupons();
  }, []);

  const handleCreate = async (data) => {
    try {
      const newCoupon = await createCoupon(data);
      toast.success('Coupon created successfully!');
      setCoupons([...coupons, newCoupon]);
      setShowCouponForm(false);
    } catch (error) {
      toast.error('Failed to create coupon');
      console.error('Error creating coupon:', error);
    }
  };

  const handleUpdate = async (id, data) => {
    const updatedCoupon = await updateCoupon(id, data);
    setCoupons(coupons.map(coupon => (coupon.id === id ? updatedCoupon : coupon)));
    toast.success('Coupon updated successfully!');
    setShowCouponForm(false);
  };

  const handleDelete = async (id) => {
    await deleteCoupon(id);
    setCoupons(coupons.filter(coupon => coupon.id !== id));
    toast.success('Coupon deleted successfully!');
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setShowCouponForm(true);
  };

  const toggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
    setEditCoupon(null);
  };

  const textColor = resolvedTheme === "dark" ? "text-white" : "text-gray-800";
  const buttonBgColor = resolvedTheme === "dark" ? "bg-gray-700" : "bg-blue-500";
  const buttonHoverBgColor = resolvedTheme === "dark" ? "bg-gray-600" : "bg-blue-600";
  const containerBgColor = resolvedTheme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <div className={`container mx-auto p-8 ${containerBgColor}`}>
      <h1 className={`text-4xl font-bold text-center mb-6 ${textColor}`}>Manage Coupons</h1>
      {session && session.user.role === 'ADMIN' && (
        <>
          <button
            className={`${buttonBgColor} text-white px-4 py-2 rounded-md shadow hover:${buttonHoverBgColor}`}
            onClick={toggleCouponForm}
          >
            Add Coupon
          </button>
          {showCouponForm && (
            <CouponForm
              onSubmit={editCoupon ? handleUpdate.bind(null, editCoupon.id) : handleCreate}
              coupon={editCoupon}
              onCancel={() => {
                setEditCoupon(null);
                setShowCouponForm(false);
              }}
            />
          )}
          <CouponList coupons={coupons} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default Coupon;
