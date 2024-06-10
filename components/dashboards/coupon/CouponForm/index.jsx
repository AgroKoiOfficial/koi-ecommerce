import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const CouponForm = ({ onSubmit, coupon = {}, onCancel }) => {
  const [code, setCode] = useState(coupon?.code || "");
  const [minimumPrice, setMinimumPrice] = useState(coupon?.minimumPrice || "");
  const [decimalValue, setDecimalValue] = useState(coupon?.decimalValue || "");
  const [percentValue, setPercentValue] = useState(coupon?.percentValue || "");
  const [discountType, setDiscountType] = useState(
    coupon?.discountType || "DECIMAL"
  );
  const [expiration, setExpiration] = useState(
    coupon?.expiration
      ? new Date(coupon.expiration).toISOString().slice(0, 16)
      : ""
  );

  useEffect(() => {
    if (coupon) {
      setCode(coupon?.code || "");
      setMinimumPrice(coupon?.minimumPrice || "");
      setDecimalValue(coupon?.decimalValue || "");
      setPercentValue(coupon?.percentValue || "");
      setDiscountType(coupon?.discountType || "DECIMAL");
      setExpiration(
        coupon?.expiration
          ? new Date(coupon.expiration).toISOString().slice(0, 16)
          : ""
      );
    }
  }, [coupon]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (discountType === "PERCENT" && decimalValue) {
      toast.info("Decimal value should be null when discount type is PERCENT");
      return;
    }

    if (discountType === "DECIMAL" && percentValue) {
      toast.info("Percent value should be null when discount type is DECIMAL");
      return;
    }

    onSubmit({
      code,
      minimumPrice,
      decimalValue: discountType === "DECIMAL" ? decimalValue : null,
      percentValue: discountType === "PERCENT" ? percentValue : null,
      discountType,
      expiration,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg mb-6">
      <div className="mb-4">
        <Label>Code</Label>
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Label>Minimum Price</Label>
        <Input
          type="number"
          value={minimumPrice}
          onChange={(e) => setMinimumPrice(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label>Price Value</Label>
        <Input
          type="number"
          value={decimalValue}
          onChange={(e) => setDecimalValue(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label>Percent Value</Label>
        <Input
          type="number"
          value={percentValue}
          onChange={(e) => setPercentValue(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label>Discount Type</Label>
        <Select
          options={[
            { value: "DECIMAL", label: "Decimal" },
            { value: "PERCENT", label: "Percent" },
          ]}
          value={discountType}
          onChange={(value) => setDiscountType(value)}
        />
      </div>
      <div className="mb-4">
        <Label>Expiration</Label>
        <Input
          type="datetime-local"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        {coupon?.id && (
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white hover:bg-gray-600">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-600">
          {coupon?.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
