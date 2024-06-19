import React, { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const EditAddress = ({ address, setIsEditing }) => {
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/address/update/${address.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      toast.success("Update Alamat Berhasil")
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center">Edit Address</h1>
      <Label htmlFor="street">Street Address</Label>
      <Input
        label="Street Address"
        name="street"
        placeholder="Street Address"
        value={formData.street}
        onChange={handleChange}
        className={errors.street ? "border-red-500" : ""}
      />
      {errors.street && (
        <p className="text-red-500 text-xs italic">{errors.street}</p>
      )}
      <Label htmlFor="postalCode">Postal Code</Label>
      <Input
        label="Postal Code"
        name="postalCode"
        placeholder="Postal Code"
        value={formData.postalCode}
        onChange={handleChange}
        className={errors.postalCode ? "border-red-500" : ""}
      />
      {errors.postalCode && (
        <p className="text-red-500 text-xs italic">{errors.postalCode}</p>
      )}
      <Label htmlFor="city">City</Label>
      <Input
        label="City"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className={errors.city ? "border-red-500" : ""}
      />
      {errors.city && <p className="text-red-500 text-xs italic">{errors.city}</p>}
      <Label htmlFor="province">Province</Label>
      <Input
        label="Province"
        name="province"
        placeholder="Province"
        value={formData.province}
        onChange={handleChange}
        className={errors.province ? "border-red-500" : ""}
      />
      {errors.province && (
        <p className="text-red-500 text-xs italic">{errors.province}</p>
      )}
      <Label htmlFor="phone">Phone</Label>
      <Input
        label="Phone"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className={errors.phone ? "border-red-500" : ""}
      />
      {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
      <div className="flex justify-end">
        <Button
          type="submit"
          className={"bg-blue-500 hover:bg-blue-600 text-white"}>
          Update
        </Button>
        <Button
          className={"ml-2 bg-red-500 hover:bg-red-600 text-white"}
          onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditAddress;
