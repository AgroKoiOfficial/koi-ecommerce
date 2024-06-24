import React, { useState, useEffect } from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CreateReview = ({ productId }) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const checkUserCanReview = async () => {
      const session = await getSession();

      if (!session) {
        setCanReview(false);
        return;
      }

      const userId = session.user.id;

      try {
        const response = await fetch(`/api/review/getUserId/${userId}`);
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          const hasCheckedOut = data.length >= 1;
          setCanReview(hasCheckedOut);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Failed to check user data:", error);
        setCanReview(false);
      }
    };

    checkUserCanReview();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();

    if (!session) {
      toast.error("You must be logged in to create a review");
      router.push("/login");
      return;
    }

    const userId = session.user.id;

    try {
      if (!canReview) {
        throw new Error("User is not allowed to review");
      }

      const response = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast.success("Review created successfully!");
        setRating(0);
        setComment("");
      } else {
        throw new Error("Failed to create review");
      }
    } catch (error) {
      console.error("Failed to create review:", error);
      toast.error("Failed to create review. Please try again later.");
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <RiStarFill
            key={i}
            className="text-yellow-500 cursor-pointer"
            onClick={() => setRating(i)}
          />
        ) : (
          <RiStarLine
            key={i}
            className="text-gray-300 cursor-pointer"
            onClick={() => setRating(i)}
          />
        )
      );
    }
    return stars;
  };

  if (!canReview) {
    return <p className="text-gray-900 font-bold text-center">Kamu tidak diizinkan untuk memberikan ulasan. Silahkan untuk masuk dan checkout</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center mb-4">
        <Label className="mr-2">Rating:</Label>
        {renderStars()}
      </div>
      <div className="mb-4">
        <Label className="mb-2">Comment:</Label>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full"
          rows={4}
        />
      </div>
      <Button
        type="submit"
        className={`bg-yellow-500 hover:bg-yellow-600 text-white`}
      >
        Submit
      </Button>
    </form>
  );
};
