
/**
 * Lexile Master - Local Phonics Engine
 * 100% Localized, GFW-immune, no API key required.
 */

const SEGMENTS_CACHE_KEY = 'lexile_segments_cache_v3';

/**
 * Play American pronunciation using Youdao (stable in China) 
 * or local browser SpeechSynthesis fallback.
 */
export const playAmericanPronunciation = (word: string) => {
  if (typeof window === 'undefined') return;
  const wordClean = word.trim().toLowerCase();

  // 1. Primary: Youdao Online Audio (Very stable in China)
  try {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(wordClean)}&type=2`;
    let audio: HTMLAudioElement | null = new Audio(audioUrl);
    
    audio.onended = () => { audio = null; };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        safeSystemTTS(wordClean);
      });
    }
  } catch (err) {
    safeSystemTTS(wordClean);
  }
};

function safeSystemTTS(word: string) {
  try {
    const w = window as any;
    const synth = w['speechSynthesis'];
    if (synth && typeof synth === 'object') {
      if (typeof synth.cancel === 'function') {
        try { synth.cancel(); } catch (e) {}
      }
      const Utterance = w['SpeechSynthesisUtterance'];
      if (Utterance && typeof synth.speak === 'function') {
        const u = new Utterance(word);
        u.lang = 'en-US';
        u.rate = 0.8;
        synth.speak(u);
      }
    }
  } catch (e) {
    console.warn("TTS failed silently.");
  }
}

/**
 * Robust Local Phonics Engine
 * Implements standard phonics rules for segmentation.
 */
export const localSegmenter = (word: string): string[] => {
  const w = word.toLowerCase();
  
  // 1. Phonics Units (Digraphs, Trigraphs, Vowel Teams)
  const units = [
    // Trigraphs
    'tch', 'dge', 'igh', 'eigh', 'ough', 'augh',
    // Digraphs
    'sh', 'ch', 'th', 'ph', 'wh', 'ck', 'ng', 'qu', 'kn', 'wr', 'gn', 'mb',
    // Vowel Teams
    'ai', 'ay', 'ee', 'ea', 'ie', 'oa', 'oe', 'ue', 'ui', 'oo', 'ou', 'ow', 'oi', 'oy', 'au', 'aw', 'ey',
    // R-controlled
    'ar', 'er', 'ir', 'or', 'ur', 'air', 'ear', 'eer', 'oar', 'oor',
    // Common Suffixes
    'tion', 'sion', 'ture', 'able', 'ible', 'ment', 'ness', 'less', 'full', 'ship', 'hood', 'ight', 'ing', 'ed', 'es'
  ];

  let rawSegments: string[] = [];
  let i = 0;
  
  while (i < w.length) {
    let matched = false;
    
    // Check for multi-letter units (longest first)
    for (const unit of units.sort((a, b) => b.length - a.length)) {
      if (w.startsWith(unit, i)) {
        rawSegments.push(word.substr(i, unit.length));
        i += unit.length;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      rawSegments.push(word[i]);
      i++;
    }
  }

  // 2. Syllable Division Logic (Simplified for Phonics Learning)
  // For short words (< 5 chars), we usually want phonemes: c-a-t
  // For longer words, we might want syllables or larger chunks.
  
  if (word.length <= 4) {
    return rawSegments;
  }

  // Post-processing: Merge Consonant + Vowel (CV) for readability in longer words
  const finalSegments: string[] = [];
  const isVowel = (s: string) => {
    const low = s.toLowerCase();
    // Check if it contains any vowel or is a vowel team
    return /[aeiouy]/.test(low);
  };

  for (let j = 0; j < rawSegments.length; j++) {
    const current = rawSegments[j];
    const next = rawSegments[j+1];
    
    // If current is consonant and next is vowel, merge them (e.g., 'ba', 'ke')
    if (!isVowel(current) && next && isVowel(next) && current.length === 1) {
      finalSegments.push(current + next);
      j++;
    } else {
      finalSegments.push(current);
    }
  }
  
  return finalSegments;
};

/**
 * Get word segments with local cache support.
 */
export const getWordSegments = async (words: string[]): Promise<Record<string, string[]>> => {
  const cachedStr = typeof localStorage !== 'undefined' ? localStorage.getItem(SEGMENTS_CACHE_KEY) : null;
  const cache: Record<string, string[]> = cachedStr ? JSON.parse(cachedStr) : {};
  
  const results: Record<string, string[]> = {};
  let cacheUpdated = false;

  for (const word of words) {
    if (cache[word]) {
      results[word] = cache[word];
    } else {
      const segments = localSegmenter(word);
      results[word] = segments;
      cache[word] = segments;
      cacheUpdated = true;
    }
  }

  if (cacheUpdated && typeof localStorage !== 'undefined') {
    localStorage.setItem(SEGMENTS_CACHE_KEY, JSON.stringify(cache));
  }

  return results;
};

/**
 * Localized feedback library.
 */
export const getAIFeedback = async (score: number): Promise<string> => {
  const feedbackMap: Record<string, string[]> = {
    high: [
      "Incredible! Your spelling is masterful.",
      "Perfect performance! You're a spelling champion.",
      "Outstanding! Your Lexile level is impressive.",
      "Bravo! You've mastered these words perfectly."
    ],
    mid: [
      "Great progress! Keep at it.",
      "Excellent work! You're nearly there.",
      "Solid effort! A few more practices and you'll be perfect.",
      "Well done! Your hard work is showing."
    ],
    low: [
      "Good effort! Let's practice some more.",
      "Keep trying! You'll get better every time.",
      "Don't give up! Every mistake is a learning step.",
      "Practice makes perfect. Let's try again!"
    ]
  };

  const category = score >= 85 ? 'high' : score >= 60 ? 'mid' : 'low';
  const options = feedbackMap[category];
  return options[Math.floor(Math.random() * options.length)];
};
