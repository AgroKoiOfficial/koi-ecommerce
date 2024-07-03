import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const useCheckout = (cart, address, shippingId, selectedCoupon, setCart) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session || !session.user) {
        throw new Error("User session not found");
      }

      const responseCart = await fetch(`/api/cart/userId/${session.user.id}`);
      if (!responseCart.ok) {
        throw new Error("Failed to fetch user's cart");
      }
      const userCartData = await responseCart.json();

      let addressId = address?.id;

      if (!addressId) {
        const addressData = {
          phone: address?.phone || "",
          city: address?.city || "",
          postalCode: address?.postalCode || "",
          province: address?.province || "",
          street: address?.street || "",
          userId: session.user.id,
        };

        const addressResponse = await fetch("/api/address/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        });

        if (!addressResponse.ok) {
          const errorText = await addressResponse.text();
          throw new Error(`Failed to save address: ${errorText}`);
        }

        const newAddress = await addressResponse.json();
        addressId = newAddress.id;
      } else {
        const addressResponse = await fetch(`/api/address/userId/${session.user.id}`);
        if (!addressResponse.ok) {
          const errorText = await addressResponse.text();
          throw new Error(`Failed to fetch user's addresses: ${errorText}`);
        }
        const existingAddresses = await addressResponse.json();
        
        const existingAddress = existingAddresses.find(addr => addr.id === addressId);
        if (!existingAddress) {
          throw new Error("Address not found");
        }
        addressId = existingAddress.id;
      }

      const checkoutResponse = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          addressId: addressId,
          shippingId: shippingId,
          couponId: selectedCoupon,
          cart: userCartData,
        }),
      });

      if (checkoutResponse.ok) {
        setMessage("Checkout successful!");
        setCart([]);
      } else {
        const errorText = await checkoutResponse.text();
        setMessage("Checkout failed!");
      }
    } catch (error) {
      setMessage(`Checkout failed: ${error.message}`);
    }
    setLoading(false);
  };

  return { handleCheckout, loading, message };
};

export default useCheckout;
