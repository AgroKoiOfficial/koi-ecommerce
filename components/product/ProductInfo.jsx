import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { formatRupiah } from "@/utils/currency";
import { Button } from "@/components/ui/Button";

const ProductInfo = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    const session = await getSession();
    if (!session) {
      toast.error("You must be logged in to add product to cart");
      setLoading(false);
      return router.push("/login");
    }

    try {
      const { user } = session;
      const response = await fetch("/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          total: product.price,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast.success("Product added to cart successfully!");
        router.push("/cart");
      } else {
        const errorData = await response.json();
        toast.error("Failed to add product to cart. Stock not enough. ");
      }
    } catch (error) {
      toast.error("Failed to add product to cart. stock not enough.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">
        {product.name}
      </h1>
      <p className="lg:text-lg mb-4">
        <span className="font-bold">Price:</span> {formatRupiah(product.price)}
      </p>
      <p className="mb-4">
        <span className="font-bold">Category:</span> {product.category}
      </p>
      <p className="mb-4">
        <span className="font-bold">Stock:</span> {product.stock}
      </p>
      <div className="mb-4">
        <span className="font-bold">Description:</span>
        <p className="mt-2">{product.description}</p>
      </div>
      <div className="mb-4 md:w-1/5">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white"
          onClick={handleAddToCart}
          disabled={loading}>
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
