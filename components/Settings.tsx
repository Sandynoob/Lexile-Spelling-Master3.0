
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

  const [downloading, setDownloading] = useState(false);

  const handleCheckUpdates = async () => {
    setChecking(true);
    setUpdateStatus('idle');
    setErrorMessage(null);
    setUpdateInfo(null);
    
    const result = await checkUpdates();
    
    setChecking(false);
    if (result.info) {
      setUpdateInfo(result.info);
      if (result.available) {
        setUpdateStatus('available');
      } else {
        setUpdateStatus('latest');
        setTimeout(() => setUpdateStatus('idle'), 5000);
      }
    } else if (result.error) {
      setUpdateStatus('error');
      setErrorMessage(result.error);
    }
  };

  const handleDownload = async () => {
    if (!updateInfo) return;
    
    setDownloading(true);
    
    // Use direct APK URL if available, otherwise fallback to release page
    const url = updateInfo.apkUrl || updateInfo.downloadUrl;
    
    try {
      // On Android, opening a direct APK link with '_system' triggers the system downloader
      // which runs in the background (notification bar) without leaving the app.
      window.open(url, '_system');
      
      // Keep the "Downloading" state for a few seconds to give feedback
      setTimeout(() => {
        setDownloading(false);
      }, 3000);
    } catch (err) {
      setDownloading(false);
      window.open(updateInfo.downloadUrl, '_system');
    }
  };

  return (
    <div className="p-6 flex flex-col items-center animate-pop">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <span className="text-white font-kids text-4xl">L</span>
        </div>
        <h2 className="font-kids text-2xl text-indigo-900 leading-tight text-center">
          Lexile<br />Spelling Master
        </h2>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Current Version</p>
        <p className="text-indigo-600 font-kids text-lg">V{packageJson.version}</p>
      </div>

      <div className="w-full space-y-4">
        <div className="bg-white p-5 rounded-3xl border border-indigo-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h3 className="font-kids text-indigo-900">Software Update</h3>
              <span className="text-[8px] text-slate-400 font-mono">Build: V{packageJson.version}-RELEASE</span>
            </div>
            <button 
              onClick={handleCheckUpdates}
              disabled={checking || downloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                (checking || downloading)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${(checking || downloading) ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : downloading ? 'Downloading...' : 'Check Now'}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {updateStatus === 'latest' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 p-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are using the latest version!</span>
                </div>
                {updateInfo && (
                  <span className="text-[10px] text-emerald-500/70 ml-6">
                    Server Version: V{updateInfo.version}
                  </span>
                )}
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
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    downloading 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {downloading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Starting Download...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3" />
                      Download & Install Now
                    </>
                  )}
                </button>
                <p className="text-[9px] text-slate-400 mt-2 text-center">
                  The update will download in the background. Check your notification bar.
                </p>
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
