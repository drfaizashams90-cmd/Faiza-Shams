/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Play, Pause, SkipBack, SkipForward, Volume2, Info, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PODCAST_SCRIPT = `
Podcast Title: Skin Science with Dr Faiza Shams
Episode 1: Jild ko Samjhein — Khubsurti Nahi, Science

[Intro Music Fade In]

Assalam o Alaikum,

Main hoon Dr Faiza Shams — aur aap sun rahe hain Skin Science.

Yeh podcast un sab logon ke liye hai jo apni jild ko sirf makeup ya fairness ke zariye nahi, balkay scientific understanding ke through samajhna chahte hain.

Agar aap confuse hain ke:
Kaunsa serum use karein?
Retinol kab start karein?
Vitamin C waqai kaam karta hai ya sirf hype hai?
Pigmentation kyun hoti hai?
Skin barrier damage kya hota hai?

Toh yeh jagah aap ke liye hai.

Yahan hum trends nahi, science ki baat karenge.

Aaj ka topic:
Jild ko samajhna kyun zaroori hai?

Hum aksar apni skin ko sirf mirror mein dekhte hain — lekin kya hum usay waqai samajhte hain?

Skin sirf ek surface nahi hai.
Yeh hamare jism ka sab se bara organ hai.
Yeh humein pollution, UV rays, bacteria aur chemicals se protect karti hai.

Agar aap apni skin ki structure aur function samajh lein — toh aap kabhi bhi marketing claims ka shikar nahi banenge.

Skin ki bunyadi structure.

Skin ki teen main layers hoti hain:
Epidermis — sab se upar wali layer.
Dermis — beech ki layer.
Hypodermis — sab se neeche wali layer.

Epidermis protective shield hai jahan melanin banta hai.
Dermis mein collagen aur elastin hotay hain.
Hypodermis cushioning aur insulation provide karti hai.

Skin problems randomly nahi hotin.

Acne, pigmentation, redness aur dullness aksar hotay hain:
Inflammation,
Hormonal imbalance,
UV exposure,
Barrier damage,
aur galat products ke istemal ki wajah se.

Jab hum root cause nahi samajhte,
toh hum sirf symptoms treat karte rehte hain.

Is podcast ka maqsad hai:
Ingredients ki science samajhna.
Retinol, peptides, aur niacinamide ko scientifically explain karna.
Pigmentation aur melasma ko logically break down karna.
Indian aur Pakistani skin ke liye realistic guidance dena.

Yeh platform marketing ke khilaf nahi,
lekin misinformation ke khilaf zaroor hai.

Closing:

Agar aap apni skin ko samajhna chahte hain,
usay heal karna chahte hain,
aur scientifically smart decisions lena chahte hain,
toh is podcast ko follow karein.

Next episode mein hum baat karenge:
Skin Barrier kya hota hai aur yeh damage kaise hota hai.

Tab tak ke liye,
apni jild ka khayal rakhein.
Science ke saath.

Allah Hafiz.
`;

const VOICE_INSTRUCTIONS = `
Voice Style: Professional female dermatologist voice, Age 35–45. Confident, calm, educated, and warm tone. Neutral Pakistani / South Asian accent. Clear pronunciation of Roman Urdu words.
Speaking Style: Podcast host delivery. Authoritative but friendly. Scientific yet conversational. No exaggerated emotions. Natural breathing and realistic pacing.
Pacing: Medium-slow speed. Clear pauses between sections. Slight emphasis on educational statements.
Emotion: Trustworthy, intelligent, reassuring. Like a medical expert educating patients.
Audio Direction: Studio podcast quality. Smooth transitions. Soft intro energy -> confident educational middle -> calm closing tone.
Important: Pronounce Roman Urdu naturally. Avoid robotic rhythm. Use natural pauses after headings. Slight smile tone during greeting. Gentle emphasis on key words like "science", "skin", "understanding".
`;

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generatePodcastAudio = async () => {
    if (audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ 
          parts: [{ 
            text: `${VOICE_INSTRUCTIONS}\n\nRead the following podcast script:\n${PODCAST_SCRIPT}` 
          }] 
        }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is typically a professional female voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const url = `data:audio/mp3;base64,${base64Audio}`;
        setAudioUrl(url);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Failed to generate audio. Please check your API key and network.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioUrl) {
      generatePodcastAudio();
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-serif selection:bg-emerald-100">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a1a1a]/10 bg-white/50 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold">Scientific Dermatology</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6"
          >
            Skin Science <br />
            <span className="italic font-normal text-emerald-900">with Dr Faiza Shams</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#1a1a1a]/60 max-w-2xl font-sans"
          >
            Episode 1: Jild ko Samjhein — Khubsurti Nahi, Science. 
            Understanding skin through the lens of medical expertise.
          </motion.p>
        </header>

        {/* Player Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[32px] shadow-2xl shadow-emerald-900/5 border border-white p-8 md:p-12 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Volume2 className="w-32 h-32" />
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            {/* Cover Art */}
            <div className="w-64 h-64 shrink-0 rounded-2xl overflow-hidden shadow-xl relative group">
              <img 
                src="https://picsum.photos/seed/dermatology/600/600" 
                alt="Podcast Cover" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    animate={{ width: isPlaying ? "100%" : "0%" }}
                    transition={{ duration: 180, ease: "linear" }} // Mock duration
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 w-full">
              <div className="mb-8">
                <h3 className="text-2xl font-medium mb-1">Episode 1: The Foundation</h3>
                <p className="text-emerald-700 font-sans text-sm font-medium">Dr. Faiza Shams • 12:45</p>
              </div>

              <div className="flex items-center justify-between mb-8">
                <button className="p-3 hover:bg-emerald-50 rounded-full transition-colors opacity-40 cursor-not-allowed">
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-20 h-20 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>

                <button className="p-3 hover:bg-emerald-50 rounded-full transition-colors opacity-40 cursor-not-allowed">
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans font-medium text-[#1a1a1a]/40 uppercase tracking-widest">
                <span>00:00</span>
                <div className="flex-1 h-px bg-[#1a1a1a]/10 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 bg-[#1a1a1a] rounded-full" />
                </div>
                <span>12:45</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Script Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-b border-[#1a1a1a]/10 pb-4">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-medium tracking-tight">Podcast Transcript</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <aside className="md:col-span-4 space-y-8">
              <div className="p-6 bg-white rounded-2xl border border-[#1a1a1a]/5">
                <h4 className="text-sm font-sans font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Key Topics
                </h4>
                <ul className="space-y-3 text-sm font-sans text-[#1a1a1a]/60">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    Skin as an organ, not just a surface
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    The three layers: Epidermis, Dermis, Hypodermis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    Root causes vs. Symptoms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    Scientific decision making
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-emerald-900 text-white rounded-2xl">
                <p className="text-xs font-sans uppercase tracking-[0.2em] opacity-60 mb-2">Next Episode</p>
                <h4 className="text-lg mb-4">The Skin Barrier: Damage & Repair</h4>
                <button className="text-xs font-sans font-bold uppercase tracking-wider border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-emerald-900 transition-colors">
                  Coming Soon
                </button>
              </div>
            </aside>

            <div className="md:col-span-8 space-y-8 text-lg leading-relaxed text-[#1a1a1a]/80">
              {PODCAST_SCRIPT.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('[') && paragraph.endsWith(']')) {
                  return (
                    <div key={idx} className="text-sm font-sans font-semibold text-emerald-700 uppercase tracking-widest py-4 border-y border-emerald-100">
                      {paragraph}
                    </div>
                  );
                }
                if (paragraph.includes(':')) {
                  const [title, ...content] = paragraph.split(':');
                  return (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-xl font-medium text-[#1a1a1a]">{title}:</h3>
                      <p>{content.join(':')}</p>
                    </div>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-[#1a1a1a]/10 text-center">
  <p className="text-sm font-sans text-[#1a1a1a]/40">
    ©{" "}
    <a
      href="https://drfaizashams.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-[#1a1a1a]/70 transition-colors"
    >
      2026 Skin Science with Dr Faiza Shams
    </a>
    . All rights reserved. <br />
    Medical information provided for educational purposes.
  </p>
</footer>
      </main>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}
