"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

// --- 設定內容 ---
const DIRECTIONS = ['南下', '北上'];
const STOPS = ['1 站', '2 站', '3 站', '4 站', '5 站', '6 站'];
const TASKS = ['買咖啡', '拍合照', '吃美食', '伏地挺身', '請喝飲料', '搭訕路人', '原地解散'];

export default function SlotMachine() {
  const [reels, setReels] = useState(['方向', '站數', '任務']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('準備好接受挑戰了嗎？');

  // 使用 useRef 來記錄計時器 ID，這樣我們才能隨時「喊停」
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  // 清除計時器的保護機制 (如果元件被移除，強制停止)
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 這是主要的控制開關
  const toggleSpin = () => {
    if (isSpinning) {
      stopSpin();
    } else {
      startSpin();
    }
  };

  const startSpin = () => {
    setIsSpinning(true);
    setMessage('🎲 命運安排中... (點擊按鈕停止)');

    // 設定速度 (越小越快)
    const speed = 50;

    // 開始無限迴圈轉動
    intervalRef.current = setInterval(() => {
      setReels([
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
        STOPS[Math.floor(Math.random() * STOPS.length)],
        TASKS[Math.floor(Math.random() * TASKS.length)],
      ]);
    }, speed);
  };

  const stopSpin = () => {
    // 清除計時器，停止轉動
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 雖然視覺上停了，我們再做最後一次隨機取樣確保公平性，並鎖定結果
    const finalDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const finalStop = STOPS[Math.floor(Math.random() * STOPS.length)];
    const finalTask = TASKS[Math.floor(Math.random() * TASKS.length)];

    setReels([finalDirection, finalStop, finalTask]);
    setIsSpinning(false);
    setMessage('✨ 任務鎖定！出發吧！ ✨');
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const saveTicket = async () => {
    if (ticketRef.current === null) return;
    try {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `mission-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('截圖失敗:', err);
      alert('截圖失敗');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">

      {/* --- 截圖區域 (Ticket) --- */}
      <div
        ref={ticketRef}
        className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-8 border-yellow-400 relative overflow-hidden"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-wider">MISSION START</h1>
          <p className="text-sm text-slate-500 font-bold">隨機任務指令書</p>
        </div>

        {/* 拉霸視窗區 */}
        <div className="flex justify-center gap-2 bg-slate-100 p-4 rounded-2xl border-inner mb-6 shadow-inner">
          <div className="w-1/3 h-28 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
            <span className="text-2xl md:text-3xl font-bold text-blue-600">{reels[0]}</span>
          </div>
          <div className="w-1/3 h-28 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
            <span className="text-2xl md:text-3xl font-bold text-red-500">{reels[1]}</span>
          </div>
          <div className="w-1/3 h-28 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 px-2 text-center">
            <span className="text-xl md:text-2xl font-bold text-slate-800 break-words leading-tight">
              {reels[2]}
            </span>
          </div>
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="font-bold text-yellow-800 text-lg">{message}</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">{new Date().toLocaleString()}</p>
        </div>

        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-slate-900 rounded-full transform -translate-y-1/2"></div>
      </div>

      {/* --- 按鈕區 --- */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-md">

        {/* 主要控制按鈕：根據 isSpinning 狀態改變顏色與文字 */}
        <button
          onClick={toggleSpin}
          className={`w-full font-bold py-4 rounded-full text-xl shadow-lg transform active:scale-95 transition-all
            ${isSpinning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse' // 轉動時顯示黃色警告色
              : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white' // 靜止時顯示原本的粉紅色
            }`}
        >
          {isSpinning ? '✋ 停止 (STOP)' : '🚀 開始抽選 (GO)'}
        </button>

        <button
          onClick={saveTicket}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>📸</span> 保存任務卡
        </button>
      </div>
    </div>
  );
}