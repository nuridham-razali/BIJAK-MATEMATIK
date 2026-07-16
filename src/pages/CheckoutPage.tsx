import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/Mascot';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Ralat semasa checkout');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border-4 border-yellow-300 relative z-10">
        <div className="flex justify-center mb-6">
          <Mascot size={120} mood="excited" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Beli Akses Penuh</h1>
        <p className="text-center text-slate-500 mb-8 font-medium">Lesen Seumur Hidup - RM 50.00</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold text-center">{error}</div>}

        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Emel Ibu Bapa (Untuk Akaun)</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none font-medium transition-all"
              placeholder="contoh@gmail.com"
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 font-medium">
            Sila pastikan emel ini betul kerana ia akan digunakan untuk mendaftar akaun induk anda.
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_6px_0_#2563eb] active:translate-y-2 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Teruskan ke Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
}
