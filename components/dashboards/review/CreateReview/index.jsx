import React, { useState } from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";

export const CreateReview = ({ productId }) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const userId = session.user.id;

    try {
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
        alert("Review created successfully!");
      } else {
        throw new Error("Failed to create review");
      }
    } catch (error) {
      console.error("Failed to create review:", error);
      alert("Failed to create review. Please try again later.");
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
          className="w-full "
          rows={4}
        />
      </div>
      <Button
        type="submit"
        className={`bg-yellow-500 hover:bg-yellow-600 text-white`}>
        Submit
      </Button>
    </form>
  );
};
