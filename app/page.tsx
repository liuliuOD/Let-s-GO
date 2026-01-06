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
  const [reportImage, setReportImage] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReportImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startSpin = () => {
    setIsSpinning(true);
    setReportImage(null);
    setMessage(UI_TEXT.ROLLING);
    intervalRef.current = setInterval(() => {
      setReels(SLOT_CONFIG.map(cat => cat.items[Math.floor(Math.random() * cat.items.length)]));
    }, 50);
  };

  const stopSpin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSpinning(false);
    setMessage(UI_TEXT.PHOTO_DONE);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 py-12 select-none">

      {/* 任務卡片區 */}
      <div ref={ticketRef} className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-8 border-yellow-400 relative overflow-hidden">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{UI_TEXT.TITLE}</h1>
          <p className="text-sm text-slate-500 font-bold italic underline decoration-yellow-400">{UI_TEXT.SUBTITLE}</p>
        </div>

        {/* 轉盤格子 */}
        <div className="flex justify-center gap-2 bg-slate-200 p-4 rounded-2xl mb-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
          {reels.map((text, i) => (
            <div key={i} className={`flex-1 h-24 bg-white rounded-xl flex items-center justify-center shadow-md border-b-4 border-slate-300 ${isSpinning ? 'animate-pulse' : ''}`}>
              <span className={`font-bold break-words px-1 text-center leading-tight ${SLOT_CONFIG[i].colorClass} ${text.length > 4 ? 'text-lg' : 'text-xl'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* 圖片上傳回報區 */}
        {!isSpinning && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group mb-4 w-full h-48 border-4 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all overflow-hidden relative"
          >
            {reportImage ? (
              <>
                <img src={reportImage} alt="Report" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <span className="text-3xl mb-1 drop-shadow-lg">🔄</span>
                  <p className="text-xs font-black drop-shadow-lg">{UI_TEXT.PHOTO_CHANGE}</p>
                </div>
              </>
            ) : (
              <div className="text-center flex flex-col items-center group-hover:scale-110 transition-transform">
                <span className="text-4xl mb-2 animate-bounce">📸</span>
                <p className="text-xs text-slate-400 font-bold group-hover:text-yellow-600 transition-colors">
                  {UI_TEXT.PHOTO_UPLOAD}
                </p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        )}

        {/* 底部訊息 */}
        <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-300">
          <p className="font-bold text-yellow-800">{message}</p>
        </div>
      </div>

      {/* 按鈕互動區 */}
      <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md">

        {/* PUSH 按鈕容器 */}
        <div className="relative group flex items-center justify-center">
          {/* 指引小手：移至左側，使用內建的 animate-ping 或自定義簡單位移 */}
          {!isSpinning && !reportImage && (
            <span className="absolute -left-14 text-4xl pointer-events-none 
      opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
      group-hover:animate-[bounce-x_1s_infinite]">
              👉
            </span>
          )}

          <button
            onClick={() => isSpinning ? stopSpin() : startSpin()}
            className={`relative w-44 h-44 rounded-full font-black text-3xl transition-all border-b-[12px] active:border-b-0 active:translate-y-[12px] 
      ${isSpinning
                ? 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-[0_0_40px_rgba(250,204,21,0.4)] cursor-wait'
                : 'bg-red-500 border-red-700 text-white shadow-2xl hover:brightness-110 cursor-pointer'
              }`}
          >
            {isSpinning ? UI_TEXT.SPIN_STOP : UI_TEXT.SPIN_START}
          </button>
        </div>

        {/* 保存按鈕 */}
        <button
          onClick={() => toPng(ticketRef.current!).then(url => {
            const link = document.createElement('a');
            link.download = `mission-report.png`;
            link.href = url;
            link.click();
          })}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold py-4 rounded-2xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">
            {UI_TEXT.SAVE_BUTTON}
          </span>
        </button>
      </div>

      {/* 留言板 */}
      <Giscus />
    </div>
  );
}
