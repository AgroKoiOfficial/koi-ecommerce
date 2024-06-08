import React, { useEffect, useState } from "react";
import { formatRupiah } from "@/utils/currency";
import { getSession } from "next-auth/react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Image from "next/image";

function Cart() {
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
          setCartData(updatedCartData);
        }
      } else {
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

  return (
    <main className="pt-20 lg:pt-24 overflow-y-auto mx-auto mb-56">
      {cartData.map((item) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row items-center mt-8 mb-4 mx-4 relative bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-center md:justify-start items-center md:mr-4">
            <Image
              src={item.product.image}
              alt={item.product.name}
              priority={true}
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
          <div className="flex-1 md:ml-4">
            <p className="text-sm md:text-md lg:text-lg mb-2">
              {item.product.name}
            </p>
            <p className="text-sm md:text-md lg:text-lg mb-2">
              Price: {formatRupiah(item.product.price)}
            </p>
            <div className="flex items-center mt-2 md:mt-4">
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-2">
                <FaMinus className="text-gray-600" />
              </button>
              <p className="px-4 py-2 bg-gray-100 text-gray-800">
                {item.quantity}
              </p>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-2">
                <FaPlus className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="ml-auto mt-4 md:mt-0">
            <button onClick={() => handleDeleteItem(item.id)}>
              <FaTrash className="text-red-600 hover:text-red-800" />
            </button>
          </div>
        </div>
      ))}
      {cartData.length > 0 && (
        <div className="mt-8 mx-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Total Quantity:</p>
            <p className="text-lg font-semibold">{calculateTotalQuantity()}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-lg font-semibold">Total Price:</p>
            <p className="text-lg font-semibold">
              {formatRupiah(calculateTotalPrice())}
            </p>
          </div>
        </div>
      )}
      {cartData.length === 0 && (
        <p className="text-center mt-8 text-gray-500">Your cart is empty</p>
      )}
    </main>
  );
}

export default Cart;
