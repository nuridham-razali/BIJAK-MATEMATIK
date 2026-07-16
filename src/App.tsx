import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Pages (to be implemented)
import LandingPage from "@/pages/LandingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PaymentFailedPage from "@/pages/PaymentFailedPage";
import ParentLogin from "@/pages/ParentLogin";
import ParentDashboard from "@/pages/ParentDashboard";
import StudentLogin from "@/pages/StudentLogin";
import StudentDashboard from "@/pages/StudentDashboard";
import TopicNotes from "@/pages/TopicNotes";
import QuizPage from "@/pages/QuizPage";
import QuizResult from "@/pages/QuizResult";
import Leaderboard from "@/pages/Leaderboard";

export default function App() {
  const [user, setUser] = useState<any>(undefined); // undefined means loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50 font-['Baloo_2',sans-serif]">Memuatkan...</div>;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-sky-50 font-['Baloo_2',sans-serif] text-slate-800 selection:bg-yellow-200">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/login" element={user ? <Navigate to="/parent/dashboard" /> : <ParentLogin />} />
          <Route path="/parent/dashboard" element={user ? <ParentDashboard /> : <Navigate to="/login" />} />
          <Route path="/student/login" element={user ? <StudentLogin /> : <Navigate to="/login" />} />
          
          {/* Student routes (in reality should be protected by checking if a student is selected in state/localstorage, for simplicity we allow access but they will read from localstorage or context) */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/topic/:topicId/notes" element={<TopicNotes />} />
          <Route path="/student/topic/:topicId/quiz" element={<QuizPage />} />
          <Route path="/student/topic/:topicId/result" element={<QuizResult />} />
          <Route path="/student/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
