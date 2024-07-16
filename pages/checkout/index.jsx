import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import useCart from "@/hooks/checkout/useCart";
import useRegions from "@/hooks/checkout/useRegions";
import useCoupons from "@/hooks/checkout/useCoupons";
import useCheckout from "@/hooks/checkout/useCheckout";
import { formatRupiah } from "@/utils/currency";
import { Input } from "@/components/ui/Input";

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
  const [hasCheckedOutBefore, setHasCheckedOutBefore] = useState(false);

  const { handleCheckout, loading, message } = useCheckout(
    cart,
    createNewAddress ? address : addresses.find(addr => addr.id === selectedAddressId),
    shippingId,
    selectedCoupon,
    setCart
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(`/api/address/userId/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
          if (data.length > 0) {
            setSelectedAddressId(data[0].id);
            setCreateNewAddress(false); 
            setHasCheckedOutBefore(true);
          } else {
            setCreateNewAddress(true); 
            setHasCheckedOutBefore(false);
          }
        } else if (response.status === 404) {
          setAddresses([]);
          setCreateNewAddress(true);
          setHasCheckedOutBefore(false);
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

  const handleCheckoutClick = () => {
    if (createNewAddress && (!address.phone || !address.city || !address.postalCode || !address.province || !address.street)) {
      setMessage("Please fill out all address fields.");
      return;
    }
    handleCheckout();
  };

  return (
    <div className="container mx-auto p-4 grid gap-4 grid-cols-1 md:grid-cols-2 pt-8">
      <div className="md:col-span-1 mt-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Pulau</h2>
          <select onChange={handleRegionChange} className="border p-2 w-full">
            <option value="">Pilih Pulau</option>
            {regions.map((region) => (
              <option key={region.region} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </div>
        {region && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Kota</h2>
            <select onChange={handleCityChange} className="border p-2 w-full">
              <option value="">Pilih Kota</option>
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city} - {formatRupiah(city.fee)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Kupon</h2>
          <select
            onChange={(e) => setSelectedCoupon(e.target.value)}
            className="border p-2 w-full">
            <option value="">Pilih Kupon</option>
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
        {hasCheckedOutBefore && !createNewAddress ? (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Pilih Alamat</h2>
            <select
              onChange={handleAddressSelect}
              className="border p-2 w-full"
              value={selectedAddressId}>
              <option value="">Pilih Alamat</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {`${addr.street}, ${addr.city}, ${addr.province}, ${addr.postalCode}`}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNewAddress}
              className="mt-2 bg-gray-200 text-gray-800 p-2 rounded">
              Buat Alamat Baru
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Masukan Alamat</h2>
            <div className="mb-4">
            <Input
              type="text"
              placeholder="Nomor Hp"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            </div>
            <div className="mb-4">
            <Input
              type="text"
              placeholder="Kota"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            </div>
            <div className="mb-4">
            <Input
              type="text"
              placeholder="Kode Pos"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
            />
            </div>
            <div className="mb-4">
            <Input
              type="text"
              placeholder="Provinsi"
              value={address.province}
              onChange={(e) =>
                setAddress({ ...address, province: e.target.value })
              }
            />
            </div>
            <div className="mb-4">
            <Input
              type="text"
              placeholder="Jalan"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-1 mt-4 lg:m-4">
        <h2 className="text-xl font-semibold mb-4">Produk</h2>
        {cart.map((item) => (
          <div
            key={item.id}
            className="border p-4 mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={100}
                height={100}
                className="mr-4"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="font-light">{item.quantity} x {formatRupiah(item.product.price)}</p>
              </div>
            </div>
            <p className="font-semibold">
              {formatRupiah(item.quantity * item.product.price)}
            </p>
          </div>
        ))}

        <div className="border-t-2 border-b-2 py-2 mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Total:</p>
            <p className="font-semibold">
              {formatRupiah(cart.reduce((total, item) => total + item.quantity * item.product.price, 0))}
            </p>
          </div>
        </div>

        {message && <p className="text-red-600">{message}</p>}

        <button
          onClick={handleCheckoutClick}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded">
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
