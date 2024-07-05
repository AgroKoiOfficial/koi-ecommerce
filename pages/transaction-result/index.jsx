import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TransactionResult = () => {
  const router = useRouter();
  const { order_id, status_code, transaction_status } = router.query;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status_code && transaction_status) {
      if (status_code === '200' && transaction_status === 'settlement') {
        setMessage('Transaksi berhasil!');
      } else {
        setMessage('Transaksi gagal atau masih menunggu.');
      }
    }
  }, [status_code, transaction_status]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Hasil Transaksi</h1>
        <div className="mb-6">
          <p className="text-lg">{message}</p>
          <p className="text-gray-600">ID Pesanan: {order_id}</p>
        </div>
        <a href="/" className="text-blue-500 hover:underline">Kembali ke Beranda</a>
      </div>
    </main>
  );
};

export default TransactionResult;