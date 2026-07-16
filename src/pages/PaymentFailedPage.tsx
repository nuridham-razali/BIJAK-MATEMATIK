import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/Mascot';

export default function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center border-4 border-red-300">
        <div className="flex justify-center mb-6">
          <Mascot size={120} mood="sad" />
        </div>
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">Pembayaran Gagal</h1>
        <p className="text-slate-600 mb-8 font-medium">Maaf, transaksi anda tidak berjaya. Sila cuba lagi atau guna kaedah pembayaran yang lain.</p>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_6px_0_#2563eb] active:translate-y-2 active:shadow-none transition-all"
        >
          Cuba Lagi
        </button>
      </div>
    </div>
  );
}
