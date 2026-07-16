import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Mascot } from '@/components/Mascot';
import { Home, Trophy, Star, RotateCcw } from 'lucide-react';

export default function QuizResult() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<{score: number, total: number} | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const resStr = localStorage.getItem(`result_${topicId}`);
    if (resStr) {
      const res = JSON.parse(resStr);
      setResult(res);
      saveToFirebase(res);
    } else {
      navigate('/student/dashboard');
    }
  }, [topicId, navigate]);

  const saveToFirebase = async (res: {score: number, total: number}) => {
    if (saved) return;
    const studentId = localStorage.getItem('currentStudentId');
    if (!studentId || !auth.currentUser) return;

    try {
      // Add result record
      await addDoc(collection(db, "families", auth.currentUser.uid, "students", studentId, "results"), {
        topicId,
        score: res.score,
        total: res.total,
        completedAt: Date.now()
      });

      // Update total score
      const studentRef = doc(db, "families", auth.currentUser.uid, "students", studentId);
      await updateDoc(studentRef, {
        totalScore: increment(res.score)
      });
      
      setSaved(true);
    } catch (error) {
      console.error("Failed to save result", error);
    }
  };

  if (!result) return null;

  const percentage = Math.round((result.score / result.total) * 100);
  let feedback = "";
  let mood: 'excited' | 'happy' | 'neutral' | 'sad' = 'neutral';
  let stars = 0;

  if (percentage === 100) {
    feedback = "Sempurna! Kamu memang Bijak Matematik!";
    mood = 'excited';
    stars = 3;
  } else if (percentage >= 80) {
    feedback = "Hebat! Teruskan usaha yang cemerlang.";
    mood = 'happy';
    stars = 2;
  } else if (percentage >= 50) {
    feedback = "Bagus, tapi kamu boleh buat lebih baik lagi.";
    mood = 'neutral';
    stars = 1;
  } else {
    feedback = "Jangan putus asa! Mari cuba lagi.";
    mood = 'sad';
    stars = 0;
  }

  return (
    <div className="min-h-screen bg-sky-50 p-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl max-w-lg w-full text-center border-8 border-yellow-300 relative">
        <div className="flex justify-center mb-6">
          <Mascot size={150} mood={mood} />
        </div>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <Star key={i} size={48} className={i <= stars ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
          ))}
        </div>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Kuiz Tamat!</h1>
        <p className="text-xl font-bold text-blue-500 mb-8">{feedback}</p>

        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-8 flex justify-around">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Markah</p>
            <p className="text-5xl font-extrabold text-green-500">{result.score}</p>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Soalan</p>
            <p className="text-5xl font-extrabold text-slate-800">{result.total}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xl py-4 rounded-2xl shadow-[0_6px_0_#2563eb] active:translate-y-2 active:shadow-none transition-all flex justify-center items-center gap-2"
          >
            <Home /> Kembali ke Dashboard
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/student/topic/${topicId}/quiz`)}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-3 rounded-2xl transition-colors flex justify-center items-center gap-2"
            >
              <RotateCcw size={18} /> Cuba Lagi
            </button>
            <button 
              onClick={() => navigate('/student/leaderboard')}
              className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-3 rounded-2xl transition-colors flex justify-center items-center gap-2"
            >
              <Trophy size={18} /> Papan Pendahulu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
