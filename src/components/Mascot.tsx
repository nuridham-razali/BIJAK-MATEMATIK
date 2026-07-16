import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ mood?: 'happy' | 'neutral' | 'sad' | 'excited', size?: number, className?: string }> = ({ mood = 'neutral', size = 100, className = '' }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot Body */}
      <rect x="50" y="80" width="100" height="90" rx="20" fill="#4ADE80" />
      <rect x="70" y="100" width="60" height="40" rx="10" fill="#FFFFFF" opacity="0.3" />
      
      {/* Robot Head */}
      <rect x="40" y="20" width="120" height="80" rx="30" fill="#3B82F6" />
      
      {/* Antenna */}
      <line x1="100" y1="20" x2="100" y2="5" stroke="#94A3B8" strokeWidth="6" />
      <circle cx="100" cy="5" r="10" fill="#FBBF24" />
      
      {/* Eyes based on mood */}
      {mood === 'sad' ? (
        <>
          <path d="M 60 50 Q 75 40 90 50" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 110 50 Q 125 40 140 50" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'excited' ? (
        <>
          <path d="M 60 50 L 75 35 L 90 50" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 110 50 L 125 35 L 140 50" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="75" cy="50" r="12" fill="white" />
          <circle cx="125" cy="50" r="12" fill="white" />
          <circle cx="75" cy="50" r="4" fill="#1E40AF" />
          <circle cx="125" cy="50" r="4" fill="#1E40AF" />
        </>
      )}

      {/* Mouth */}
      {mood === 'sad' ? (
        <path d="M 80 80 Q 100 70 120 80" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      ) : mood === 'excited' ? (
        <path d="M 80 70 Q 100 100 120 70 Z" fill="#EF4444" />
      ) : (
        <path d="M 80 75 Q 100 90 120 75" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
      )}
      
      {/* Arms */}
      <motion.path 
        d="M 50 110 Q 20 120 20 150" 
        stroke="#4ADE80" strokeWidth="16" fill="none" strokeLinecap="round" 
        animate={{ d: mood === 'excited' ? "M 50 110 Q 20 80 20 60" : "M 50 110 Q 20 120 20 150" }}
      />
      <motion.path 
        d="M 150 110 Q 180 120 180 150" 
        stroke="#4ADE80" strokeWidth="16" fill="none" strokeLinecap="round" 
        animate={{ d: mood === 'excited' ? "M 150 110 Q 180 80 180 60" : "M 150 110 Q 180 120 180 150" }}
      />
    </motion.svg>
  );
};
