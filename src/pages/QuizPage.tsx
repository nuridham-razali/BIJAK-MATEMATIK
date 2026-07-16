import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOPICS } from '@/data/topics';
import { generateQuestionsForTopic } from '@/data/questionGenerator';
import { Question } from '@/types';
import { Mascot } from '@/components/Mascot';
import { Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = TOPICS.find(t => t.id === topicId);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(0); // Optional timer, e.g., 60s per question
  
  useEffect(() => {
    if (topic) {
      // In a real app, fetch from Firestore. Here we generate.
      setQuestions(generateQuestionsForTopic(topic.id, topic.year));
    }
  }, [topic]);

  useEffect(() => {
    // Reset state when question changes
    setShowExplanation(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(60); // 60 seconds per question
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation && questions.length > 0) {
      // Time's up
      handleTimeUp();
    }
  }, [timeLeft, showExplanation, questions]);

  const handleTimeUp = () => {
    setIsCorrect(false);
    setShowExplanation(true);
  };

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    
    setSelectedOption(index);
    const correct = index === questions[currentIndex].correctAnswerIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save result and go to result page
      localStorage.setItem(`result_${topicId}`, JSON.stringify({ score, total: questions.length }));
      navigate(`/student/topic/${topicId}/result`);
    }
  };

  if (!topic || questions.length === 0) return <div className="min-h-screen bg-sky-50 flex items-center justify-center font-bold text-2xl text-blue-500">Menyediakan soalan...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-sky-50 p-4 flex flex-col">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto bg-white rounded-3xl p-4 shadow-sm border-2 border-blue-100 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/student/dashboard')} className="text-slate-400 hover:text-slate-600 font-bold px-2">X</button>
          <div className="font-bold text-slate-700">Soalan {currentIndex + 1} / {questions.length}</div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
          <Clock size={18} /> 00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </header>

      {/* Main Question Area */}
      <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Mascot & Feedback Area */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-start bg-white p-6 rounded-3xl border-4 border-yellow-200 text-center">
          <Mascot size={150} mood={showExplanation ? (isCorrect ? 'excited' : 'sad') : 'neutral'} />
          
          {showExplanation && (
            <div className={`mt-4 p-4 rounded-2xl border-2 w-full animate-bounce ${isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <h3 className="font-extrabold text-2xl mb-1">{isCorrect ? 'Hebat!' : 'Aww...'}</h3>
              <p className="font-medium text-sm">{isCorrect ? 'Jawapan kamu tepat!' : 'Tidak mengapa, cuba lagi selepas ini.'}</p>
            </div>
          )}
          
          {!showExplanation && (
             <div className="mt-4 p-4 bg-blue-50 text-blue-700 font-bold rounded-2xl w-full border-2 border-blue-100">
               Fikir baik-baik!
             </div>
          )}
        </div>

        {/* Question & Options */}
        <div className="w-full md:w-2/3 bg-white p-6 md:p-8 rounded-3xl border-4 border-blue-200 flex flex-col shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm capitalize">
            Tahap: {currentQ.difficulty}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-4 mb-4 leading-relaxed whitespace-pre-line">
            {currentQ.text}
          </h2>

          {currentQ.imageUrl && (
            <div className="mb-8 flex justify-center w-full">
              <img src={currentQ.imageUrl} alt="Ilustrasi soalan" className="max-h-48 rounded-xl" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {currentQ.options.map((opt, i) => {
              let btnClass = "bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300";
              
              if (showExplanation) {
                if (i === currentQ.correctAnswerIndex) {
                  btnClass = "bg-green-100 border-4 border-green-400 text-green-800 scale-105 shadow-md";
                } else if (i === selectedOption) {
                  btnClass = "bg-red-100 border-2 border-red-300 text-red-500 opacity-50";
                } else {
                  btnClass = "bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-50";
                }
              } else if (selectedOption === i) {
                btnClass = "bg-blue-100 border-2 border-blue-400 text-blue-800";
              }

              return (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(i)}
                  className={`p-4 md:p-6 rounded-2xl font-extrabold text-xl md:text-2xl transition-all ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {showExplanation && (
            <div className="mt-8 pt-6 border-t-2 border-slate-100 animate-fade-in">
              <h4 className="font-extrabold text-slate-700 mb-2">Cara Pengiraan / Penyelesaian:</h4>
              <div className="bg-blue-50 p-4 rounded-2xl border-l-4 border-blue-500 text-blue-900 font-medium whitespace-pre-wrap font-mono">
                {currentQ.explanation}
              </div>
              
              <button 
                onClick={handleNext}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xl py-4 rounded-2xl shadow-[0_6px_0_#2563eb] active:translate-y-2 active:shadow-none transition-all"
              >
                {currentIndex < questions.length - 1 ? 'Soalan Seterusnya' : 'Lihat Keputusan'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
