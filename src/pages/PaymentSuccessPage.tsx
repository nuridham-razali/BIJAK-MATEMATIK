import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Mascot } from '@/components/Mascot';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      if (email) {
        provider.setCustomParameters({ login_hint: email });
      }
      
      const userCred = await signInWithPopup(auth, provider);
      
      // Create family document
      await setDoc(doc(db, "families", userCred.user.uid), {
        email: userCred.user.email,
        paymentStatus: "paid",
        createdAt: Date.now()
      });

      navigate('/parent/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center relative z-10 border-4 border-green-300">
        <div className="flex justify-center mb-6">
          <Mascot size={120} mood="happy" />
        </div>
        <h1 className="text-3xl font-extrabold text-green-600 mb-2">Pembayaran Berjaya!</h1>
        <p className="text-slate-600 mb-8 font-medium">Terima kasih atas pembelian anda. Sila log masuk dengan akaun Google anda untuk mendaftar dan mengaktifkan lesen.</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-6 text-left">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-lg py-4 rounded-2xl shadow-[0_4px_0_#e2e8f0] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            {loading ? 'Memproses...' : 'Teruskan dengan Google'}
          </button>
        </form>
      </div>
    </div>
  );
}
