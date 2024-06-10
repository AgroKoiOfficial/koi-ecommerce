export const getCoupons = async () => {
    const response = await fetch('/api/coupons');
    if (!response.ok) {
      throw new Error('Failed to fetch coupons');
    }
    return await response.json();
  };
  
  export const createCoupon = async (data) => {
    const response = await fetch('/api/coupons/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create coupon:', errorData);
      throw new Error('Failed to create coupon');
    }
  
    return await response.json();
  };
  
  
  export const updateCoupon = async (id, data) => {
    const response = await fetch(`/api/coupons/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update coupon');
    }
    return await response.json();
  };
  
  export const deleteCoupon = async (id) => {
    const response = await fetch(`/api/coupons/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete coupon');
    }
    return await response.json();
  };
  