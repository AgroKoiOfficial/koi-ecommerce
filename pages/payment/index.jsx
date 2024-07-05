import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

const PaymentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [checkoutId, setCheckoutId] = useState("");

  useEffect(() => {
    const fetchCheckoutTotal = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/checkout/userId/${session.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user's checkout");
        }

        const data = await response.json();
        console.log(data);

        if (data.checkouts.length > 0) {
          const latestCheckout = data.checkouts[data.checkouts.length - 1]; // Get the last element
          setCheckoutId(latestCheckout.id);
          setTotal(latestCheckout.total);
          setProductName(latestCheckout.cart.create[0].product.name);
          setQuantity(latestCheckout.cart.create[0].quantity);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    };

    fetchCheckoutTotal();
  }, [router]);

  const handlePayment = async () => {
    const session = await getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          checkoutId: checkoutId,
          status: "UNPAID",
        }),
      });

      if (response.ok) {
        const paymentData = await response.json();
        window.location.href = paymentData.url;
      } else {
        console.error("Failed to initiate payment:", response.statusText);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Payment Page</title>
      </Head>
      <h1 className="text-2xl font-semibold mb-4">Payment Details</h1>
      <p>Product Name: {productName}</p>
      <p>Quantity: {quantity}</p>
      <p>Total Amount: {total}</p>
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white p-2 rounded mt-4">
        Proceed to Payment
      </button>
    </div>
  );
};

export default PaymentPage;
