import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const session = await getSession();
      if (session && session.user) {
        try {
          const response = await fetch(`/api/cart/userId/${session.user.id}`);
          const data = await response.json();
          setCart(data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };

    fetchCart();
  }, []);

  return { cart, setCart };
};

export default useCart;
