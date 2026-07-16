import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mascot } from '@/components/Mascot';

export default function ParentLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/parent/dashboard');
    } catch (err: any) {
      setError("Log masuk gagal. Sila cuba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border-4 border-blue-200 text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={100} mood="happy" />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Log Masuk</h1>
        <p className="text-slate-500 mb-8 font-medium">Akaun Induk / Ibu Bapa</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-lg py-4 rounded-2xl shadow-[0_4px_0_#e2e8f0] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            {loading ? 'Log Masuk...' : 'Log Masuk dengan Google'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 font-medium">
          Belum ada akaun? <Link to="/checkout" className="text-blue-600 font-bold hover:underline">Beli Lesen Sekarang</Link>
        </p>
      </div>
    </div>
  );
}
