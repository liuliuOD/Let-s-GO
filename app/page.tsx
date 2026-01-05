"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { SLOT_CONFIG, UI_TEXT } from './constants';
import Giscus from './giscus';

export default function SlotMachine() {
  const [reels, setReels] = useState<string[]>(SLOT_CONFIG.map(c => c.label));
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState(UI_TEXT.HINT);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const toggleSpin = () => {
    if (isSpinning) stopSpin();
    else startSpin();
  };

  const startSpin = () => {
    setIsSpinning(true);
    setMessage(UI_TEXT.ROLLING);
    intervalRef.current = setInterval(() => {
      setReels(SLOT_CONFIG.map(category =>
        category.items[Math.floor(Math.random() * category.items.length)]
      ));
    }, 50);
  };

  const stopSpin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSpinning(false);
    setMessage(UI_TEXT.GO);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* 任務卡片區域 */}
      <div ref={ticketRef} className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-8 border-yellow-400 relative overflow-hidden">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{UI_TEXT.TITLE}</h1>
          <p className="text-sm text-slate-500 font-bold italic underline decoration-yellow-400">{UI_TEXT.SUBTITLE}</p>
        </div>

        {/* 格子排版 */}
        <div className="flex justify-center gap-2 bg-slate-200 p-4 rounded-2xl mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
          {reels.map((text, i) => (
            <div key={i} className={`flex-1 h-28 bg-white rounded-xl flex items-center justify-center shadow-md border-b-4 border-slate-300 transition-all ${isSpinning ? 'animate-pulse' : ''}`}>
              <span className={`font-bold break-words px-1 text-center leading-tight ${SLOT_CONFIG[i].colorClass} ${text.length > 4 ? 'text-lg' : 'text-2xl'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-300">
          <p className="font-bold text-yellow-800 text-lg">{message}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">{new Date().toLocaleString()}</p>
        </div>

        {/* 裝飾孔洞 */}
        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full -translate-y-1/2"></div>
        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full -translate-y-1/2"></div>
      </div>

      {/* 按鈕區域 */}
      <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md">
        <button
          onClick={toggleSpin}
          className={`relative w-44 h-44 rounded-full font-black text-3xl transition-all border-b-[12px] active:border-b-0 active:translate-y-[12px] ${isSpinning ? 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 'bg-red-500 border-red-700 text-white shadow-2xl'}`}
        >
          {isSpinning ? UI_TEXT.SPIN_STOP : UI_TEXT.SPIN_START}
          <div className="absolute top-4 left-6 w-10 h-5 bg-white/20 rounded-full blur-sm"></div>
        </button>

        <button
          onClick={() => toPng(ticketRef.current!).then(url => {
            const link = document.createElement('a');
            link.download = `task.png`; link.href = url; link.click();
          })}
          className="w-full bg-slate-800 text-slate-400 font-bold py-3 rounded-2xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          {UI_TEXT.SAVE_BUTTON}
        </button>
      </div>

      <Giscus />
    </div>
  );
}