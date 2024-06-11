import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import useCart from "@/hooks/checkout/useCart";
import useRegions from "@/hooks/checkout/useRegions";
import useCoupons from "@/hooks/checkout/useCoupons";
import useCheckout from "@/hooks/checkout/useCheckout";
import { formatRupiah } from "@/utils/currency";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const {
    regions,
    region,
    cities,
    city,
    shippingId,
    handleRegionChange,
    handleCityChange,
  } = useRegions();
  const { coupons, selectedCoupon, setSelectedCoupon } = useCoupons();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [address, setAddress] = useState({
    phone: "",
    city: "",
    postalCode: "",
    province: "",
    street: "",
  });
  const [createNewAddress, setCreateNewAddress] = useState(false);

  const { handleCheckout, loading, message } = useCheckout(
    cart,
    address,
    shippingId,
    selectedCoupon
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(`/api/address/userId/${session.user.id}`);
        const data = await response.json();
        if (response.ok) {
          setAddresses(data);
          // Set selected address if exists
          if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          }
        }
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddressId && !createNewAddress) {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (selectedAddress) {
        setAddress({
          phone: selectedAddress.phone,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          province: selectedAddress.province,
          street: selectedAddress.street,
        });
      }
    }
  }, [selectedAddressId, addresses, createNewAddress]);

  const handleAddressSelect = (e) => {
    setSelectedAddressId(e.target.value);
    setCreateNewAddress(false);
  };

  const handleCreateNewAddress = () => {
    setCreateNewAddress(true);
    setSelectedAddressId("");
    setAddress({
      phone: "",
      city: "",
      postalCode: "",
      province: "",
      street: "",
    });
  };

  return (
    <div className="container mx-auto p-4 grid gap-4 grid-cols-1 md:grid-cols-2 pt-20">
      <div className="md:col-span-1 mt-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Region</h2>
          <select onChange={handleRegionChange} className="border p-2 w-full">
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.region} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </div>
        {region && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">City</h2>
            <select onChange={handleCityChange} className="border p-2 w-full">
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city} - {formatRupiah(city.fee)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Coupons</h2>
          <select
            onChange={(e) => setSelectedCoupon(e.target.value)}
            className="border p-2 w-full">
            <option value="">Select Coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.code} -{" "}
                {coupon.discountType === "PERCENT"
                  ? `${coupon.percentValue}%`
                  : formatRupiah(coupon.decimalValue)}
              </option>
            ))}
          </select>
        </div>
        {addresses.length > 0 && !createNewAddress ? (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Select Address</h2>
            <select
              onChange={handleAddressSelect}
              className="border p-2 w-full"
              value={selectedAddressId}>
              <option value="">Select Address</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {`${addr.street}, ${addr.city}, ${addr.province}, ${addr.postalCode}`}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNewAddress}
              className="mt-2 bg-gray-200 text-gray-800 p-2 rounded">
              Create New Address
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Enter Address</h2>
            <input
              type="text"
              placeholder="Phone"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Province"
              value={address.province}
              onChange={(e) =>
                setAddress({ ...address, province: e.target.value })
              }
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>
        )}
      </div>

      <div className="md:col-span-1 mt-4 lg:m-4">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        {cart.map((item) => (
          <div key={item.id} className="border p-2 mb-2 flex flex-col lg:flex-row items-center">
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={100}
              height={100}
             priority={true}
              style={{ width : "auto", height : "auto" }}
             
            />
            <div className="ml-4">
              <div>{item.product.name}</div>
              <div>
                {item.quantity} x {formatRupiah(item.product.price)}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <div className="text-xl font-semibold">Quantity: {cart.length}</div>
          {selectedCoupon && (
            <div className="text-xl font-semibold">
              Discount:{" "}
              {selectedCoupon.discountType === "PERCENT"
                ? `${selectedCoupon.percentValue}%`
                : formatRupiah(selectedCoupon.decimalValue)}
            </div>
          )}
          <div className="text-xl font-semibold">
            Total:{" "}
            {formatRupiah(
              cart.reduce(
                (acc, item) =>
                  acc + parseInt(item.product.price) * parseInt(item.quantity),
                0
              )
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={loading}>
        {loading ? "Processing..." : "Checkout"}
      </button>

      {/* {message && <div className="mt-4 text-red-500">{message}</div>} */}
    </div>
  );
};

export default Checkout;
