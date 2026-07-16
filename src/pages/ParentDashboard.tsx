import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, addDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Student } from '@/types';
import { Plus, Users, LogOut, Play, Trophy } from 'lucide-react';
import { Mascot } from '@/components/Mascot';

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState(1);
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, "families", auth.currentUser.uid, "students"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student));
      setStudents(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (newPin.length !== 4) {
      alert("PIN mesti 4 digit.");
      return;
    }
    try {
      await addDoc(collection(db, "families", auth.currentUser.uid, "students"), {
        name: newName,
        year: newYear,
        avatar: `avatar_${Math.floor(Math.random() * 5) + 1}`, // Random avatar for now
        pin: newPin,
        totalScore: 0
      });
      setShowAdd(false);
      setNewName('');
      setNewPin('');
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Ralat menambah murid");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleStudentLogin = (studentId: string) => {
    // Navigate to student login with pre-selected student
    navigate(`/student/login?studentId=${studentId}`);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full"><Users className="text-blue-600" /></div>
            <h1 className="text-2xl font-bold text-slate-800">Akaun Induk</h1>
          </div>
          <button onClick={handleLogout} className="text-red-500 font-bold flex items-center gap-1 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
            <LogOut size={20} /> Keluar
          </button>
        </header>

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-2">Profil Murid</h2>
            <p className="text-slate-500 font-medium">Urus profil anak-anak anda (Maksimum 5)</p>
          </div>
          {students.length < 5 && (
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              <Plus size={20} /> Tambah Murid
            </button>
          )}
        </div>

        {showAdd && (
          <div className="bg-white p-6 rounded-3xl border-4 border-yellow-300 shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-4">Tambah Profil Baru</h3>
            <form onSubmit={handleAddStudent} className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Panggilan</label>
                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-slate-200" placeholder="Ali" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tahun / Darjah</label>
                <select value={newYear} onChange={e => setNewYear(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 bg-white">
                  {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Tahun {y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">PIN Masuk (4 Digit)</label>
                <input type="text" required maxLength={4} pattern="\d{4}" value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-slate-200" placeholder="1234" />
              </div>
              <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_0_#16a34a] active:translate-y-1 active:shadow-none h-[44px]">
                Simpan
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><Mascot size={60} className="mx-auto" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
              <div key={student.id} className="bg-white rounded-[2rem] border-4 border-blue-100 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-4xl border-4 border-white shadow-inner">
                  👦🏻 {/* Can be dynamic based on student.avatar */}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">{student.name}</h3>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mt-2">
                  Tahun {student.year}
                </div>
                
                <div className="flex items-center gap-2 mt-4 text-orange-500 font-bold bg-orange-50 px-4 py-2 rounded-xl w-full justify-center">
                  <Trophy size={18} /> {student.totalScore} Mata
                </div>

                <button 
                  onClick={() => handleStudentLogin(student.id)}
                  className="mt-6 w-full bg-blue-500 text-white font-bold py-3 rounded-2xl shadow-[0_4px_0_#2563eb] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                >
                  <Play size={18} /> Mula Belajar
                </button>
              </div>
            ))}
            
            {students.length === 0 && !showAdd && (
              <div className="col-span-full text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-300">
                <Mascot size={80} mood="sad" className="mx-auto opacity-50" />
                <p className="text-slate-500 font-medium mt-4">Belum ada profil murid. Sila tambah profil baru.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
