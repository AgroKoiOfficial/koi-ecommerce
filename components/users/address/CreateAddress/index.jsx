import React, { useState } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const CreateAddress = ({ setIsCreating }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    street: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await fetch(`/api/address/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId: session.user.id }),
      });
      toast.success("Buat Alamat Berhasil")
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  return (
    <>
      <div className={`flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-3xl font-bold">Buat Alamat</h1>
      </div>
      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <Label htmlFor="street">Jalan</Label>
        <Input
          name="street"
          placeholder="Jalan"
          value={formData.street}
          onChange={handleChange}
          className={`border ${errors.street ? "border-red-500" : theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300'}`}
        />
        {errors.street && (
          <p className="text-red-500 text-xs italic">{errors.street}</p>
        )}

        <Label htmlFor="postalCode">Kode Pos</Label>
        <Input
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className={`border ${errors.postalCode ? "border-red-500" : theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300'}`}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs italic">{errors.postalCode}</p>
        )}

        <Label htmlFor="city">Kota</Label>
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={`border ${errors.city ? "border-red-500" : theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300'}`}
        />
        {errors.city && (
          <p className="text-red-500 text-xs italic">{errors.city}</p>
        )}

        <Label htmlFor="province">Provinsi</Label>
        <Input
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleChange}
          className={`border ${errors.province ? "border-red-500" : theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300'}`}
        />
        {errors.province && (
          <p className="text-red-500 text-xs italic">{errors.province}</p>
        )}

        <Label htmlFor="phone">No Hp</Label>
        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className={`border ${errors.phone ? "border-red-500" : theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300'}`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs italic">{errors.phone}</p>
        )}
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white ${theme === 'dark' ? 'border-gray-600' : 'border-blue-500'}`}>
            Buat
          </Button>
          <Button
            type="button"
            className={`ml-2 bg-red-500 hover:bg-red-600 text-white ${theme === 'dark' ? 'border-gray-600' : 'border-red-500'}`}
            onClick={() => setIsCreating(false)}>
           Batal
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateAddress;
