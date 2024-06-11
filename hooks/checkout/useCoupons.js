import { useEffect, useState } from 'react';

const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('/api/coupons');
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  return { coupons, selectedCoupon, setSelectedCoupon };
};

export default useCoupons;
