import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Mascot } from '@/components/Mascot';
import { Student } from '@/types';

export default function StudentLogin() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [pin, setPin] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId && auth.currentUser) {
      // Fetch student data to show name
      getDoc(doc(db, "families", auth.currentUser.uid, "students", studentId))
        .then(docSnap => {
          if (docSnap.exists()) {
            setStudent({ id: docSnap.id, ...docSnap.data() } as Student);
          }
        });
    } else {
      // In a real scenario, if no studentId, they might need to select their profile from a list
      // For MVP, if accessed directly, redirect back
      navigate('/parent/dashboard');
    }
  }, [studentId, navigate]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student && pin === student.pin) {
      // Save session in local storage
      localStorage.setItem('currentStudentId', student.id);
      localStorage.setItem('currentStudentName', student.name);
      localStorage.setItem('currentStudentYear', student.year.toString());
      navigate('/student/dashboard');
    } else {
      setError("PIN salah. Cuba lagi!");
      setPin('');
    }
  };

  if (!student) return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Memuatkan...</div>;

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] shadow-xl max-w-sm w-full p-8 border-4 border-yellow-300 text-center relative z-10">
        <div className="flex justify-center mb-4">
          <Mascot size={120} mood={error ? 'sad' : 'neutral'} />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Hai, {student.name}!</h1>
        <p className="text-slate-500 mb-8 font-medium">Masukkan nombor PIN rahsia kamu.</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold text-center animate-bounce">{error}</div>}

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input 
              type="password" 
              maxLength={4}
              pattern="\d{4}"
              autoFocus
              required 
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-32 text-center text-4xl tracking-[1em] px-4 py-4 rounded-2xl border-4 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none font-extrabold bg-slate-50 transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xl py-4 rounded-2xl shadow-[0_6px_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all"
          >
            Masuk!
          </button>
        </form>
        
        <button onClick={() => navigate('/parent/dashboard')} className="mt-6 text-slate-400 font-bold hover:text-slate-600">
          Bukan {student.name}?
        </button>
      </div>
    </div>
  );
}
