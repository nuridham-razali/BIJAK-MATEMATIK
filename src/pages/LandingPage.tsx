import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mascot } from '@/components/Mascot';
import { CheckCircle2, Rocket, Trophy, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-50 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-yellow-300 opacity-50"><Star size={64} fill="currentColor" /></div>
      <div className="absolute top-40 right-20 text-yellow-300 opacity-50"><Star size={48} fill="currentColor" /></div>
      <div className="absolute bottom-20 left-1/4 text-yellow-300 opacity-50"><Star size={32} fill="currentColor" /></div>
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <Mascot size={40} />
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Bijak Matematik</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full font-bold text-blue-600 bg-white border-2 border-blue-200 hover:bg-blue-50 transition-colors"
          >
            Log Masuk
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight"
          >
            Kuasa <span className="text-blue-500">Matematik</span> Di Hujung Jari!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-medium"
          >
            Latih tubi Matematik KSSR KPM untuk Tahun 1 hingga Tahun 6. Pembelajaran interaktif, menyeronokkan, dan direka khas untuk kanak-kanak Malaysia.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl border-4 border-yellow-300 shadow-xl inline-block"
          >
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Akses Seumur Hidup</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-extrabold text-green-500">RM 50.00</span>
              <span className="text-slate-400 font-medium pb-1">/ keluarga</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xl py-4 rounded-2xl shadow-[0_6px_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Rocket size={24} />
              Beli Sekarang
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">Termasuk sehingga 5 profil murid.</p>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white p-8 rounded-[3rem] shadow-2xl relative z-10 border-8 border-blue-100 flex flex-col items-center justify-center text-center"
          >
            <Mascot size={250} mood="excited" />
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg mt-4 shadow-lg transform -translate-y-6">
              Jom Belajar Bersama Cikgu Bot!
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-24 relative z-10 border-t-8 border-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center text-slate-800 mb-16">Kenapa Pilih Bijak Matematik?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle2 className="text-green-500" size={40} />}
              title="Silibus KPM Sebenar"
              desc="Soalan digubal mengikut silibus terkini Tahun 1 hingga Tahun 6."
            />
            <FeatureCard 
              icon={<Star className="text-yellow-400" size={40} />}
              title="Langkah Demi Langkah"
              desc="Bukan sekadar jawapan. Setiap soalan disertakan cara penyelesaian lengkap."
            />
            <FeatureCard 
              icon={<Trophy className="text-blue-500" size={40} />}
              title="Gamifikasi Menarik"
              desc="Kumpul lencana, mata ganjaran, dan saksikan perkembangan melalui laporan ringkas."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-sky-50 p-8 rounded-3xl text-center flex flex-col items-center">
      <div className="bg-white p-4 rounded-full shadow-md mb-6 inline-block">
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-slate-800 mb-4">{title}</h4>
      <p className="text-slate-600 font-medium">{desc}</p>
    </div>
  );
}
