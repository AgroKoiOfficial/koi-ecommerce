import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

const CheckoutList = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'ADMIN') {
        setError('Access denied');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/checkout');
        const data = await response.json();
        if (response.ok) {
          setCheckouts(data.checkouts);
        } else {
          setError(data.message || 'Failed to fetch checkouts');
        }
      } catch (err) {
        setError('Failed to fetch checkouts');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/checkout/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCheckouts(checkouts.filter((checkout) => checkout.id !== id));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete checkout');
      }
    } catch (err) {
      setError('Failed to delete checkout');
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Total</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">User ID</th>
              <th className="px-4 py-2 border-b">Address</th>
              <th className="px-4 py-2 border-b">Shipping</th>
              <th className="px-4 py-2 border-b">Coupon</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((checkout) => (
              <tr key={checkout.id}>
                <td className="px-4 py-2 border-b">{checkout.id}</td>
                <td className="px-4 py-2 border-b">{checkout.total}</td>
                <td className="px-4 py-2 border-b">{checkout.quantity}</td>
                <td className="px-4 py-2 border-b">{checkout.status}</td>
                <td className="px-4 py-2 border-b">{checkout.user.id}</td>
                <td className="px-4 py-2 border-b">
                  {checkout.address.city}, {checkout.address.province}, {checkout.address.phone}
                </td>
                <td className="px-4 py-2 border-b">
                  {checkout.shipping.city}, {checkout.shipping.region}, {checkout.shipping.fee}
                </td>
                <td className="px-4 py-2 border-b">
                  {checkout.coupon ? `${checkout.coupon.code} (${checkout.coupon.discountType})` : 'N/A'}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(checkout.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckoutList;
