import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trophy, Star, BookOpen, Home, BarChart2 } from 'lucide-react';
import { TOPICS } from '@/data/topics';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentYear, setStudentYear] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('currentStudentId');
    if (!id) {
      navigate('/login');
      return;
    }
    setStudentName(localStorage.getItem('currentStudentName') || '');
    setStudentYear(Number(localStorage.getItem('currentStudentYear') || 1));
    
    // Fetch student score
    const fetchScore = async () => {
      if (!auth.currentUser) return;
      try {
        const studentRef = doc(db, "families", auth.currentUser.uid, "students", id);
        const snap = await getDoc(studentRef);
        if (snap.exists()) {
          setTotalScore(snap.data().totalScore || 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchScore();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('currentStudentName');
    localStorage.removeItem('currentStudentYear');
    navigate('/parent/dashboard');
  };

  const topics = TOPICS.filter(t => t.year === studentYear);
  const topicsCompleted = Math.floor((totalScore / (topics.length * 30)) * 100);

  return (
    <div className="bg-[#F0F9FF] font-sans flex flex-col min-h-screen text-[#1E293B] relative select-none">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-yellow-400"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-lg border-4 border-blue-400 rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border-4 border-pink-400"></div>
        <div className="absolute top-20 right-1/3 w-24 h-12 rounded-full border-4 border-green-400 -rotate-12"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b-4 border-blue-100 flex items-center justify-between px-4 md:px-8 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl md:text-2xl font-bold text-white">+−</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-600 hidden sm:block">
            BIJAK <span className="text-yellow-500">MATEMATIK</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center bg-yellow-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-yellow-200">
            <span className="text-lg md:text-xl mr-2">⭐</span>
            <span className="font-bold text-yellow-700 text-sm md:text-lg">{totalScore} Bintang</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 bg-blue-50 px-2 py-1 md:px-3 md:py-1 rounded-full border-2 border-blue-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-blue-400 uppercase leading-none">Tahun {studentYear}</p>
              <p className="text-sm font-bold text-blue-700">{studentName}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-400 rounded-full border-2 border-white overflow-hidden flex items-center justify-center shadow-inner">
              <span className="text-lg md:text-xl">👦</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 relative z-10 overflow-auto">
        
        {/* Sidebar / Progress Summary */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-lg border-2 border-blue-50 flex-1">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-200 mb-2 relative group">
                <span className="text-5xl md:text-6xl">🤖</span>
                <div className="absolute -bottom-2 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">MASCOT: BOT-MAT</div>
              </div>
              <p className="text-center text-sm font-medium italic text-gray-500 px-2">
                "Hebat {studentName}! Teruskan usaha untuk capai Master Tahun {studentYear}!"
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.min(100, Math.max(0, topicsCompleted))}%` }}></div>
              </div>
              <p className="text-center text-xs font-bold text-gray-400 uppercase">{topicsCompleted}% SELESAI</p>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12 pointer-events-none">
              <span className="text-8xl">🏆</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Peti Lencana</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 aspect-square rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl">{totalScore >= 50 ? '⚡' : '🔒'}</span>
                </div>
                <div className="bg-white/20 aspect-square rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl">{totalScore >= 150 ? '🥇' : '🔒'}</span>
                </div>
                <div className="bg-white/20 aspect-square rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl opacity-30">🔒</span>
                </div>
                <div className="bg-white/20 aspect-square rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl opacity-30">🔒</span>
                </div>
              </div>
            </div>
            <button onClick={() => window.print()} className="mt-4 w-full bg-white text-blue-600 py-2 rounded-xl text-sm font-extrabold hover:bg-blue-50 transition-colors uppercase tracking-wider">
              Lihat Sijil
            </button>
          </div>
        </aside>

        {/* Syllabus Grid */}
        <section className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-blue-800 uppercase tracking-tight">Silibus Tahun {studentYear}</h2>
            <div className="flex gap-2">
              <div className="bg-white px-3 py-1 rounded-lg text-xs font-bold border-2 border-blue-100 text-blue-400">{topics.length} Tajuk Utama</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {topics.map((topic, i) => {
              const icons = ['🔢', '➕', '🍕', '💰', '⏰', '📏', '📐', '💬', '📊', '🌐', '🧩', '🚀', '🧠'];
              const icon = icons[i % icons.length];
              
              const borderColors = ['border-blue-400', 'border-red-400', 'border-purple-400', 'border-green-400', 'border-yellow-400', 'border-orange-400', 'border-cyan-400', 'border-pink-400'];
              const bgColors = ['bg-blue-400', 'bg-red-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-cyan-400', 'bg-pink-400'];
              const bgLightColors = ['bg-blue-100', 'bg-red-100', 'bg-purple-100', 'bg-green-100', 'bg-yellow-100', 'bg-orange-100', 'bg-cyan-100', 'bg-pink-100'];
              const textColors = ['text-blue-400', 'text-red-400', 'text-purple-400', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-cyan-400', 'text-pink-400'];
              
              const cIdx = i % borderColors.length;

              return (
                <div 
                  key={topic.id}
                  onClick={() => navigate(`/student/topic/${topic.id}/notes`)}
                  className={`bg-white rounded-3xl p-4 shadow-md border-b-8 border-r-4 ${borderColors[cIdx]} flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-1 transition-transform`}
                >
                  <div className={`w-14 h-14 ${bgLightColors[cIdx]} rounded-2xl flex items-center justify-center text-2xl mb-2`}>
                    {icon}
                  </div>
                  <h4 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{topic.title}</h4>
                  <div className="mt-auto w-full bg-gray-100 h-1.5 rounded-full mb-1">
                    <div className={`${bgColors[cIdx]} h-full w-[0%] rounded-full`}></div>
                  </div>
                  <span className={`text-[10px] font-bold text-gray-300 uppercase`}>Belum Mula</span>
                </div>
              );
            })}

            {/* Quick Play Button */}
            <div 
              onClick={() => navigate(`/student/topic/${topics[0]?.id}/quiz`)}
              className="bg-orange-500 rounded-3xl p-4 shadow-lg flex flex-col items-center justify-center text-center cursor-pointer border-b-8 border-orange-700 transform hover:-translate-y-1 transition-transform min-h-[140px]"
            >
              <div className="text-4xl mb-1">🚀</div>
              <h4 className="font-black text-white leading-tight uppercase">Cabaran<br/>Rawak</h4>
              <p className="text-[10px] text-white/80 mt-1">Dapatkan +50 Bintang!</p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-14 bg-blue-900 text-white flex items-center justify-between px-4 md:px-8 text-xs font-bold shrink-0 mt-auto z-20">
        <div className="flex gap-4 md:gap-6">
          <span className="flex items-center gap-1.5 opacity-100 cursor-pointer text-blue-200 hover:text-white transition-colors">
            <Home size={16} /> <span className="hidden sm:inline">Dashboard</span>
          </span>
          <span className="flex items-center gap-1.5 opacity-70 cursor-pointer hover:opacity-100 transition-colors">
            <BarChart2 size={16} /> <span className="hidden sm:inline">Laporan Progress</span>
          </span>
          <span 
            onClick={() => navigate('/student/leaderboard')}
            className="flex items-center gap-1.5 opacity-70 cursor-pointer hover:opacity-100 transition-colors"
          >
            <Trophy size={16} /> <span className="hidden sm:inline">Papan Kedudukan</span>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-blue-300 hidden sm:inline">ID PELAJAR: {studentName.substring(0, 3).toUpperCase()}{studentYear}-{(localStorage.getItem('currentStudentId') || '0000').substring(0,4)}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1.5 rounded hover:bg-red-400 transition-colors flex items-center gap-1">
            <LogOut size={14} /> TUKAR PROFIL
          </button>
        </div>
      </footer>
    </div>
  );
}
