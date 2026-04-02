
import React from 'react';
import { TestRecord } from '../types';

interface HistoryProps {
  records: TestRecord[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ records, onBack }) => {
  return (
    <div className="p-4 md:p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-kids text-indigo-900">Test History</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          Back
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-kids text-xl">No test records yet!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">
                    {record.range} • {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div className="text-2xl font-kids text-indigo-900">
                    Score: {record.score}
                  </div>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full text-xs font-black text-indigo-600">
                  {record.correctCount}/{record.totalWords} Correct
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {record.results.map((res, i) => (
                  <div 
                    key={i}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border flex flex-col items-center
                      ${res.isCorrect 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-red-50 border-red-100 text-red-700'}`}
                  >
                    <span>{res.word}</span>
                    <span className="text-[10px] opacity-60 font-mono tracking-tighter">
                      {res.segments.join('-')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
