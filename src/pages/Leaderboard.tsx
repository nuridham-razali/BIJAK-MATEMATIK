import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Student } from '@/types';
import { Trophy, ArrowLeft, Medal, Star } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const currentStudentId = localStorage.getItem('currentStudentId');
  const currentStudentYear = Number(localStorage.getItem('currentStudentYear') || 1);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    if (!auth.currentUser) return;
    
    // Fetch siblings from the same family
    try {
      const q = query(
        collection(db, "families", auth.currentUser.uid, "students"),
        orderBy("totalScore", "desc")
      );
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student));
      
      // Filter by same year
      data = data.filter(s => s.year === currentStudentYear);
      
      // For gamification, add a few simulated bots if there are not many siblings
      const bots: Student[] = [
        { id: 'bot1', name: 'Alia (Bot Pintar)', year: currentStudentYear, avatar: '', pin: '', totalScore: 120 },
        { id: 'bot2', name: 'Ziqri (Bot Laju)', year: currentStudentYear, avatar: '', pin: '', totalScore: 85 },
        { id: 'bot3', name: 'Mei Mei (Bot Rajin)', year: currentStudentYear, avatar: '', pin: '', totalScore: 40 },
      ];
      
      const combined = [...data, ...bots].sort((a, b) => b.totalScore - a.totalScore);
      setStudents(combined);
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/student/dashboard')} className="bg-white p-3 rounded-xl shadow-sm text-slate-500 hover:text-blue-500">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            <h1 className="text-2xl font-extrabold text-slate-800">Juara Tahun {currentStudentYear}</h1>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border-4 border-yellow-200 overflow-hidden">
          <div className="bg-yellow-50 p-4 border-b-2 border-yellow-100 flex justify-between font-bold text-slate-500 px-8">
            <span>Kedudukan</span>
            <span>Murid</span>
            <span>Mata</span>
          </div>
          
          <div className="p-4">
            {students.map((student, index) => {
              const isMe = student.id === currentStudentId;
              
              let rankStyle = "bg-slate-50 text-slate-500 border-slate-200";
              let medal = null;
              
              if (index === 0) { rankStyle = "bg-yellow-100 text-yellow-600 border-yellow-300"; medal = <Medal className="text-yellow-500" />; }
              else if (index === 1) { rankStyle = "bg-slate-200 text-slate-600 border-slate-300"; medal = <Medal className="text-slate-400" />; }
              else if (index === 2) { rankStyle = "bg-orange-100 text-orange-700 border-orange-300"; medal = <Medal className="text-orange-500" />; }

              return (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 mb-3 rounded-2xl border-2 transition-transform ${isMe ? 'ring-4 ring-blue-300 bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 'border-transparent bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4 w-1/4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${rankStyle}`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
                      {isMe ? '👦🏻' : '🤖'}
                    </div>
                    <div>
                      <h3 className={`font-extrabold text-lg ${isMe ? 'text-blue-600' : 'text-slate-700'}`}>
                        {student.name} {isMe && '(Saya)'}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="w-1/4 text-right flex justify-end items-center gap-2">
                    <span className="font-extrabold text-xl text-slate-800">{student.totalScore}</span>
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
