
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Defensive Audio Service for Redmi/MIUI Devices
 */

export const playAmericanPronunciation = (word: string) => {
  if (typeof window === 'undefined') return;
  const wordClean = word.trim().toLowerCase();

  // 1. 首选方案：有道在线音频 (最稳定，不依赖系统 TTS)
  try {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(wordClean)}&type=2`;
    let audio: HTMLAudioElement | null = new Audio(audioUrl);
    
    // 自动清理，防止内存泄露
    audio.onended = () => { audio = null; };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 如果在线播放失败（如无网），尝试 fallback
        safeSystemTTS(wordClean);
      });
    }
  } catch (err) {
    safeSystemTTS(wordClean);
  }
};

/**
 * 极其防御性的系统 TTS 调用
 */
function safeSystemTTS(word: string) {
  try {
    const w = window as any;
    const synth = w['speechSynthesis'];
    
    // 必须确保 synth 存在且不是 null
    if (synth && typeof synth === 'object') {
      // 使用最原始的 apply 方式调用，防止上下文丢失
      if (typeof synth.cancel === 'function') {
        try {
          synth.cancel();
        } catch (e) {}
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
    // 永远不要在这里抛出异常
    console.warn("TTS failed silently on this hardware.");
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const getWordSegments = async (words: string[]): Promise<Record<string, string[]>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Divide the following English words into "Teaching Syllables" (教學用音節) based on Phonics rules (G2 Standard). 
      The division must follow these specific rules:
      1. VC/CV Rule: Split between two consonants (e.g., nap-kin, pup-pet).
      2. V/CV Rule (Tiger Rule): Split before a single consonant to make the first vowel long (e.g., ti-ger, pa-per).
      3. VC/V Rule (Camel Rule): Split after a single consonant to make the first vowel short (e.g., cam-el, liv-er).
      4. Consonant + le: Split before the consonant + le (e.g., ta-ble, pur-ple).
      5. Compound Words: Split between the two base words (e.g., sun-set, back-pack).
      6. Do NOT split Digraphs: Keep sh, ch, th, ph, wh, ck together (e.g., rock-et, NOT roc-ket).
      7. Single-syllable words: Identify the phonetic combinations (phonemes/graphemes) and break them into pronunciation units (發音單元).
         Examples: "cat" -> ["c", "a", "t"], "ship" -> ["sh", "i", "p"], "boat" -> ["b", "oa", "t"], "light" -> ["l", "igh", "t"], "train" -> ["tr", "ai", "n"].
      
      Return a JSON object where keys are words and values are arrays of these syllables or units.
      The segments must exactly reconstruct the original word when joined.
      Words: ${words.join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: words.reduce((acc, word) => {
            acc[word] = { type: Type.ARRAY, items: { type: Type.STRING } };
            return acc;
          }, {} as any)
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }
    
    const result = JSON.parse(response.text) as Record<string, string[]>;
    
    // 验证分段是否能拼回原单词，如果不能则回退到单字母
    const validatedResult: Record<string, string[]> = {};
    for (const word of words) {
      const segments = result[word];
      if (segments && segments.join('').toLowerCase() === word.toLowerCase()) {
        validatedResult[word] = segments;
      } else {
        validatedResult[word] = word.split('');
      }
    }
    
    return validatedResult;
  } catch (error) {
    console.error("Error getting word segments:", error);
    // Fallback: split by character if AI fails
    return words.reduce((acc, word) => {
      acc[word] = word.split('');
      return acc;
    }, {} as Record<string, string[]>);
  }
};

export const getAIFeedback = async (score: number): Promise<string> => {
  if (score >= 90) return "Incredible! Your spelling is masterful.";
  if (score >= 80) return "Excellent work! You're nearly there.";
  if (score >= 60) return "Great progress! Keep at it.";
  if (score >= 40) return "Good effort! Let's practice some more.";
  return "Keep trying! You'll get better every time.";
};
