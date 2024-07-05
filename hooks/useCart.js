import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const session = await getSession();
        if (session && session.user) {
          const userId = session.user.id;
          const response = await fetch(`/api/cart/userId/${userId}`);
          const data = await response.json();
          setCartData(data);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`/api/cart/delete/${id}`, {
        method: "DELETE",
      });
      const updatedCartData = cartData.filter((item) => item.id !== id);
      toast.success("Produk Berhasil Dihapus!");
      setCartData(updatedCartData);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`/api/cart/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        if (newQuantity === 0) {
          const updatedCartData = cartData.filter((item) => item.id !== id);
          toast.success("Produk Berhasil Dihapus!");
          setCartData(updatedCartData);
        } else {
          const updatedCartData = cartData.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity: newQuantity,
              };
            }
            return item;
          });
          toast.success("Kuantitas Berubah!");
          setCartData(updatedCartData);
        }
      } else {
        toast.error("Gagal Mengubah Kuantitas, jumlah kuantitas produk tidak lebih dari satu.");
        console.error("Failed to update quantity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotalQuantity = () => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = () => {
    return cartData.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return {
    cartData,
    handleDeleteItem,
    handleUpdateQuantity,
    calculateTotalQuantity,
    calculateTotalPrice,
  };
};
