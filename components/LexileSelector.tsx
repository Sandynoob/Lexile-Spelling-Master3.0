
import React, { useState } from 'react';
import { LexileRange } from '../types';

interface LexileSelectorProps {
  onSelect: (range: LexileRange, count: number) => void;
}

const LexileSelector: React.FC<LexileSelectorProps> = ({ onSelect }) => {
  const [wordCount, setWordCount] = useState<number>(10);

  const levels = [
    { range: LexileRange.BR_200L, color: 'bg-green-100 border-green-300 text-green-700', label: 'Starter', desc: 'Beginners' },
    { range: LexileRange.L200_400, color: 'bg-blue-100 border-blue-300 text-blue-700', label: 'Beginner', desc: 'Core Vocab' },
    { range: LexileRange.L400_600, color: 'bg-yellow-100 border-yellow-300 text-yellow-700', label: 'Intermediate', desc: 'Daily Words' },
    { range: LexileRange.L600_800, color: 'bg-orange-100 border-orange-300 text-orange-700', label: 'Advanced', desc: 'Academic' },
    { range: LexileRange.L800_1000, color: 'bg-red-100 border-red-300 text-red-700', label: 'Expert', desc: 'Professional' },
    { range: LexileRange.L1000_PLUS, color: 'bg-purple-100 border-purple-300 text-purple-700', label: 'Master', desc: 'Complex Terms' }
  ];

  const countOptions = [5, 10, 20, 50];

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-full">
      <div className="text-center mb-6">
        <h2 className="text-lg md:text-2xl font-kids text-indigo-950 mb-1">Pick a Challenge</h2>
        <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-70">
          Random Assessment - Total 100 Points
        </p>
      </div>

      {/* Word Count Selection */}
      <div className="mb-8 w-full max-w-md bg-white/60 p-4 rounded-[2rem] border border-white/80 shadow-sm">
        <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest text-center mb-3">
          Select Word Count
        </p>
        <div className="flex justify-between gap-2">
          {countOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setWordCount(opt)}
              className={`flex-1 py-2 rounded-2xl font-black text-sm transition-all duration-300 ${
                wordCount === opt
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105'
                  : 'bg-white text-indigo-400 hover:bg-indigo-50 border border-indigo-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
          {100 / wordCount} points per perfect word
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl">
        {levels.map((level) => (
          <button
            key={level.range}
            onClick={() => onSelect(level.range, wordCount)}
            className={`group p-4 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95 ${level.color} flex flex-col items-center text-center`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">{level.range}</span>
            <span className="text-xl font-black mb-1 font-kids">{level.label}</span>
            <p className="text-[11px] font-medium opacity-80">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LexileSelector;
