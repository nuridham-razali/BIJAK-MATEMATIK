import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOPICS } from '@/data/topics';
import { Mascot } from '@/components/Mascot';
import { Play } from 'lucide-react';

export default function TopicNotes() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = TOPICS.find(t => t.id === topicId);

  if (!topic) return <div>Tajuk tidak dijumpai</div>;

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-4 border-blue-200 text-center relative z-10">
        <button onClick={() => navigate('/student/dashboard')} className="absolute top-6 left-6 text-slate-400 font-bold hover:text-blue-500">
          ← Kembali
        </button>
        
        <div className="flex justify-center mb-6">
          <Mascot size={120} mood="excited" />
        </div>
        
        <div className={`inline-block ${topic.color} text-white px-4 py-1 rounded-full font-bold text-sm mb-4`}>
          Tahun {topic.year}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">{topic.title}</h1>
        
        <div className="bg-blue-50 text-blue-900 p-6 rounded-3xl font-medium text-lg leading-relaxed text-left border-2 border-blue-100 mb-8">
          <p className="mb-4">Mari kita belajar tajuk ini!</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Baca soalan dengan teliti.</li>
            <li>Gunakan kertas kosong untuk mengira jika perlu.</li>
            <li>Jangan gopoh, fikirkan langkah demi langkah.</li>
            <li>Ada 30 soalan (Mudah, Sederhana, dan KBAT).</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate(`/student/topic/${topicId}/quiz`)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-extrabold text-2xl py-5 rounded-2xl shadow-[0_6px_0_#16a34a] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
        >
          <Play fill="currentColor" size={28} /> Mula Latihan!
        </button>
      </div>
    </div>
  );
}
