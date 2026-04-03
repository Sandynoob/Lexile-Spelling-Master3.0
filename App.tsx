import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { GameState, LexileRange, Word, ScoreData, TestRecord, WordResult } from './types';
import { LEXILE_WORDS } from './constants';
import LexileSelector from './components/LexileSelector';
import SpellingGame from './components/SpellingGame';
import Results from './components/Results';
import History from './components/History';
import Settings from './components/Settings';
import { getWordSegments } from './services/phonicsService';

const HISTORY_KEY = 'lexile_test_history_v2';
const MAX_HISTORY_SESSIONS = 10;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<TestRecord[]>([]);
  const [currentRange, setCurrentRange] = useState<LexileRange>(LexileRange.BR_200L);

  // 監聽導航事件
  useEffect(() => {
    const handleGoToHistory = () => setGameState(GameState.HISTORY);
    window.addEventListener('go-to-history', handleGoToHistory);
    return () => window.removeEventListener('go-to-history', handleGoToHistory);
  }, []);

  // 初始化數據與 AdMob
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistoryRecords(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // --- AdMob 初始化與橫幅顯示 ---
    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize();
          
          // 1. 顯示底部橫幅廣告
          await AdMob.showBanner({
            adId: 'ca-app-pub-9053893199466734/4831734476',
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: false
          });

          // 2. 預加載插屏廣告 (為了遊戲結束時能即時顯示)
          await AdMob.prepareInterstitial({
            adId: 'ca-app-pub-9053893199466734/4448591090',
            isTesting: false
          });
        } catch (e) {
          console.error("AdMob 初始化或加載失敗", e);
        }
      }
    };
    initAdMob();

    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMob.removeBanner().catch(console.error);
      }
    };
  }, []);

  const saveToHistory = (record: TestRecord) => {
    const newHistory = [record, ...historyRecords].slice(0, MAX_HISTORY_SESSIONS);
    setHistoryRecords(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const startTest = async (range: LexileRange, count: number) => {
    setIsLoading(true);
    setCurrentRange(range);
    
    const rawPool = LEXILE_WORDS[range];
    const uniquePoolMap = new Map<string, Word>();
    rawPool.forEach(w => {
      const key = w.word.toLowerCase();
      if (!uniquePoolMap.has(key)) uniquePoolMap.set(key, w);
    });
    const pool = Array.from(uniquePoolMap.values());
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, count);
    
    try {
      const segmentsMap = await getWordSegments(selected.map(w => w.word));
      setCurrentWords(selected.map(w => ({
        ...w,
        segments: segmentsMap[w.word] || w.word.split('')
      })));
      setGameState(GameState.PLAYING);
    } catch (error) {
      setCurrentWords(selected.map(w => ({ ...w, segments: w.word.split('') })));
      setGameState(GameState.PLAYING);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async (data: ScoreData, results: WordResult[]) => {
    const record: TestRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      range: currentRange,
      score: data.totalScore,
      correctCount: data.correctFirstTry,
      totalWords: data.totalWords,
      results: results
    };
    saveToHistory(record);
    setScoreData(data);
    setGameState(GameState.FINISHED);

    // --- 遊戲結束：顯示插屏廣告 ---
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.showInterstitial();
        // 顯示完後立刻預加載下一份，確保下次還能用
        await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-9053893199466734/4448591090',
          isTesting: false
        });
      } catch (e) {
        console.warn("無法顯示插屏廣告", e);
      }
    }
  };

  const resetGame = () => {
    setGameState(GameState.START);
    setScoreData(null);
    setCurrentWords([]);
  };

  return (
    <div className={`min-h-[100dvh] h-[100dvh] flex flex-col p-4 md:p-6 transition-colors overflow-hidden relative bg-slate-50 
      ${Capacitor.isNativePlatform() ? 'pb-[60px]' : ''}`}>
      
      {/* Header */}
      <header className={`flex-none w-full mx-auto transition-all duration-500 flex flex-col items-center justify-center z-20 
        ${gameState === GameState.PLAYING ? 'h-[8vh] mb-2' : 'h-[15vh] md:h-[20vh] mb-4'}`}>
        <div className="flex flex-col items-center cursor-pointer group" onClick={() => gameState !== GameState.PLAYING && resetGame()}>
          <div className={`bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transition-all 
            ${gameState === GameState.PLAYING ? 'w-8 h-8 mb-1' : 'w-12 h-12 md:w-16 md:h-16 mb-2'}`}>
            <span className={`text-white font-kids ${gameState === GameState.PLAYING ? 'text-lg' : 'text-2xl md:text-4xl'}`}>L</span>
          </div>
          <h1 className={`font-kids text-indigo-900 transition-all ${gameState === GameState.PLAYING ? 'text-sm' : 'text-xl md:text-3xl'}`}>
            Lexile Spelling Master
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden z-10">
        {gameState === GameState.START && (
          <LexileSelector onStart={startTest} isLoading={isLoading} />
        )}

        {gameState === GameState.PLAYING && (
          <SpellingGame 
            words={currentWords} 
            onFinish={handleFinish} 
            onCancel={resetGame}
          />
        )}

        {gameState === GameState.FINISHED && scoreData && (
          <Results 
            data={scoreData} 
            onReset={resetGame} 
          />
        )}

        {gameState === GameState.HISTORY && (
          <History 
            records={historyRecords} 
            onBack={() => setGameState(GameState.START)} 
          />
        )}
      </main>

      {/* Footer Navigation (Optional Settings) */}
      {gameState === GameState.START && (
        <div className="flex justify-center gap-4 mt-2">
          <button onClick={() => setGameState(GameState.HISTORY)} className="text-indigo-600 font-medium">History</button>
        </div>
      )}
    </div>
  );
};

export default App;
