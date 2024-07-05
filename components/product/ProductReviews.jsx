import React, { useState } from "react";
import GetReview from "@/components/dashboards/review/GetReview";
import { CreateReview } from "@/components/dashboards/review/CreateReview";
import { Button } from "@/components/ui/Button";

const ProductReviews = ({ productId }) => {
  const [activeTab, setActiveTab] = useState("getReviews");

  return (
    <div className="mt-8 lg:mt-12">
      <h2 className="text-2xl font-bold mb-4">Review</h2>
      <div className="flex mb-4">
        <Button
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "getReviews"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("getReviews")}
        >
          Review
        </Button>
        <Button
          className={`px-4 py-2 rounded ${
            activeTab === "createReview"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("createReview")}
        >
          Komentar
        </Button>
      </div>
      <div className="flex flex-col">
        <div className="w-full">
          {activeTab === "getReviews" && <GetReview productId={productId} />}
        </div>
        <div className="w-full lg:pl-4 mt-4 lg:mt-0">
          {activeTab === "createReview" && (
            <CreateReview productId={productId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
