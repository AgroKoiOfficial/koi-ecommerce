import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
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

  const { resolvedTheme } = useTheme();

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
      toast.info("Nilai desimal harus nol ketika jenis diskon adalah PERSEN");
      return;
    }

    if (discountType === "DECIMAL" && percentValue) {
      toast.info("Nilai persen harus nol ketika jenis diskon adalah DESIMAL");
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

  const containerBgColor = resolvedTheme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-gray-800";
  const buttonCancelBgColor = resolvedTheme === "dark" ? "bg-gray-700" : "bg-gray-500";
  const buttonCancelHoverBgColor = resolvedTheme === "dark" ? "bg-gray-600" : "bg-gray-600";
  const buttonSubmitBgColor = resolvedTheme === "dark" ? "bg-blue-700" : "bg-blue-500";
  const buttonSubmitHoverBgColor = resolvedTheme === "dark" ? "bg-blue-600" : "bg-blue-600";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${containerBgColor} p-6 shadow-md rounded-lg mb-6`}>
      <div className="mb-4">
        <Label className={textColor}>Kode</Label>
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Label className={textColor}>Harga Minimum</Label>
        <Input
          type="number"
          value={minimumPrice}
          onChange={(e) => setMinimumPrice(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label className={textColor}>Nilai Desimal</Label>
        <Input
          type="number"
          value={decimalValue}
          onChange={(e) => setDecimalValue(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label className={textColor}>Nilai Persen</Label>
        <Input
          type="number"
          value={percentValue}
          onChange={(e) => setPercentValue(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label className={textColor}>Jenis Diskon</Label>
        <Select
          options={[
            { value: "DECIMAL", label: "Desimal" },
            { value: "PERCENT", label: "Persen" },
          ]}
          value={discountType}
          onChange={(value) => setDiscountType(value)}
        />
      </div>
      <div className="mb-4">
        <Label className={textColor}>Kadaluarsa</Label>
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
            className={`${buttonCancelBgColor} text-white hover:${buttonCancelHoverBgColor}`}>
            Batal
          </Button>
        )}
        <Button
          type="submit"
          className={`${buttonSubmitBgColor} text-white hover:${buttonSubmitHoverBgColor}`}>
          {coupon?.id ? "Perbarui" : "Buat"}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
