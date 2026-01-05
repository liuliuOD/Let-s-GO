"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

const DIRECTIONS = ['南下', '北上'];
const STOPS = ['1 站', '2 站', '3 站', '4 站', '5 站', '6 站'];
const TASKS = ['買咖啡', '拍合照', '吃美食', '伏地挺身', '請喝飲料', '搭訕路人', '原地解散'];

export default function SlotMachine() {
  const [reels, setReels] = useState(['方向', '站數', '任務']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('準備好接受挑戰了嗎？');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const toggleSpin = () => {
    if (isSpinning) {
      stopSpin();
    } else {
      startSpin();
    }
  };

  const startSpin = () => {
    setIsSpinning(true);
    setMessage('🎲 命運安排中...');
    intervalRef.current = setInterval(() => {
      setReels([
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
        STOPS[Math.floor(Math.random() * STOPS.length)],
        TASKS[Math.floor(Math.random() * TASKS.length)],
      ]);
    }, 50);
  };

  const stopSpin = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSpinning(false);
    setMessage('✨ 任務鎖定！出發吧！ ✨');
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">

      {/* 門票區域保持不變 */}
      <div ref={ticketRef} className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-8 border-yellow-400 relative overflow-hidden transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-800">MISSION START</h1>
          <p className="text-sm text-slate-500 font-bold italic underline decoration-yellow-400">隨機任務指令書</p>
        </div>

        <div className="flex justify-center gap-2 bg-slate-200 p-4 rounded-2xl mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
          {reels.map((text, i) => (
            <div key={i} className={`w-1/3 h-28 bg-white rounded-xl flex items-center justify-center shadow-md border-b-4 border-slate-300 transition-all ${isSpinning ? 'animate-pulse' : ''}`}>
              <span className={`font-bold break-words px-1 ${i === 0 ? 'text-blue-600 text-2xl' : i === 1 ? 'text-red-500 text-2xl' : 'text-slate-800 text-xl'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-300">
          <p className="font-bold text-yellow-800 text-lg">{message}</p>
        </div>

        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full -translate-y-1/2"></div>
        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full -translate-y-1/2"></div>
      </div>

      {/* --- 互動感按鈕區 --- */}
      <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md">

        {/* 3D 大按鈕設計 */}
        <div className="relative group">
          <button
            onClick={toggleSpin}
            className={`
              relative w-48 h-48 rounded-full font-black text-2xl transition-all duration-75
              flex items-center justify-center border-b-[12px] active:border-b-0 active:translate-y-[12px]
              ${isSpinning
                ? 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                : 'bg-red-500 border-red-700 text-white shadow-xl'}
            `}
          >
            {isSpinning ? 'STOP!' : 'PUSH'}
            {/* 按鈕表面的反光效果 */}
            <div className="absolute top-4 left-6 w-12 h-6 bg-white/20 rounded-full blur-sm"></div>
          </button>
        </div>

        <button
          onClick={() => toPng(ticketRef.current!).then(url => {
            const link = document.createElement('a');
            link.download = 'mission.png'; link.href = url; link.click();
          })}
          className="w-full bg-slate-800 text-slate-400 font-bold py-3 rounded-2xl hover:bg-slate-700 hover:text-white transition-all border-b-4 border-slate-950 active:border-b-0 active:translate-y-[4px]"
        >
          📸 保存任務存根
        </button>
      </div>
    </div>
  );
}