import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { formatRupiah } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

const ProductInfo = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async () => {
    setLoading(true);
    const session = await getSession();
    if (!session) {
      toast.error('Kamu harus login terlebih dahulu');
      setLoading(false);
      return router.push('/login');
    }

    try {
      const { user } = session;
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          total: product.price,
          quantity: 1,
        }),
      });

      if (response.ok) {
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        toast.success('Produk ditambahkan ke keranjang');
        router.push('/cart');
      } else {
        const errorData = await response.json();
        toast.error('Gagal menambahkan produk ke keranjang, stok tidak cukup');
      }
    } catch (error) {
      toast.error('Gagal menambahkan produk ke keranjang, stok tidak cukup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">
        {product.name}
      </h1>
      <p className="lg:text-lg mb-4">
        <span className="font-bold">Harga:</span> {formatRupiah(product.price)}
      </p>
      <p className="mb-4">
        <span className="font-bold">Kategori:</span> {product.category}
      </p>
      <p className="mb-4">
        <span className="font-bold">Stok:</span> {product.stock}
      </p>
      <div className="mb-4">
        <span className="font-bold">Deskripsi:</span>
        <p className="mt-2">{product.description}</p>
      </div>
      {product.stock > 0 ? (
        <div className="mb-4 md:w-1/5 lg:w-1/3">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? 'Menambahkan...' : 'Tambah keranjang'}
          </Button>
        </div>
      ) : (
        <p className="text-red-500 font-bold">Stok Habis</p>
      )}
    </div>
  );
};

export default ProductInfo;
