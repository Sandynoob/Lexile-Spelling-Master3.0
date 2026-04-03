
import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkUpdates, UpdateInfo } from '../services/updateService';
import packageJson from '../package.json';

const Settings: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'latest' | 'available' | 'error'>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckUpdates = async () => {
    setChecking(true);
    setUpdateStatus('idle');
    setErrorMessage(null);
    
    const result = await checkUpdates();
    
    setChecking(false);
    if (result.available && result.info) {
      setUpdateStatus('available');
      setUpdateInfo(result.info);
    } else if (result.error) {
      setUpdateStatus('error');
      setErrorMessage(result.error);
    } else {
      setUpdateStatus('latest');
      // Reset status after 3 seconds
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center animate-pop">
      <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
        <span className="text-white font-kids text-4xl">L</span>
      </div>
      
      <h2 className="font-kids text-2xl text-indigo-900 mb-2">Lexile Master</h2>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Version {packageJson.version}</p>

      <div className="w-full space-y-4">
        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h3 className="font-kids text-indigo-900">Software Update</h3>
              <span className="text-[8px] text-slate-400 font-mono">Build: V1.0.6-DEBUG-0403</span>
            </div>
            <button 
              onClick={handleCheckUpdates}
              disabled={checking}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                checking 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Check Now'}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {updateStatus === 'latest' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 p-3 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>You are using the latest version!</span>
              </motion.div>
            )}

            {updateStatus === 'available' && updateInfo && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100"
              >
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold mb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>New Version Available: {updateInfo.version}</span>
                </div>
                {updateInfo.releaseNotes && (
                  <p className="text-slate-600 text-xs mb-3 leading-relaxed whitespace-pre-line">
                    {updateInfo.releaseNotes}
                  </p>
                )}
                <button 
                  onClick={() => window.open(updateInfo.url, '_system')}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Download Now
                </button>
              </motion.div>
            )}

            {updateStatus === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 p-4 rounded-2xl border border-rose-100"
              >
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Update Check Failed</span>
                </div>
                <p className="text-rose-500 text-[10px] font-mono break-all leading-relaxed">
                  {errorMessage || 'Unknown error occurred.'}
                </p>
                <div className="mt-2 pt-2 border-t border-rose-100">
                  <p className="text-slate-400 text-[9px]">
                    Tip: Ensure your phone can access GitHub or jsDelivr.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <h3 className="font-kids text-indigo-900 mb-2">About the App</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Lexile Master is a professional spelling assessment tool designed for students. 
            It uses the Lexile framework to provide level-appropriate challenges and 
            leverages a local phonics engine for accurate phonetic segments.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <h3 className="font-kids text-indigo-900 mb-2">Key Features</h3>
          <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
            <li>Lexile-based word levels</li>
            <li>Local phonetic segmentation</li>
            <li>American English pronunciation</li>
            <li>Detailed progress history</li>
            <li>Offline-first rule engine</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <h3 className="font-kids text-indigo-900 mb-2">Technical Info</h3>
          <p className="text-slate-500 text-xs font-mono mb-2">
            Built with React 19, Tailwind CSS, and Capacitor. 
            Powered by a Local Phonics Engine (GFW-Immune).
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span>Local Architecture & GFW-Immune</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Lexile Master Team
        </p>
      </div>
    </div>
  );
};

export default Settings;
