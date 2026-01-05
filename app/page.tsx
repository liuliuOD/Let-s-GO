"use client";

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

// 定義拉霸機的圖案
const ITEMS = ['💎', '🍎', '🍋', '🍒', '🍇', '🔔', '7️⃣'];

export default function SlotMachine() {
  const [reels, setReels] = useState(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('準備好試試手氣了嗎？');
  
  // 這是我們要截圖的目標區域 Ref
  const ticketRef = useRef<HTMLDivElement>(null);

  // 拉霸邏輯
  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setMessage('轉動中...');

    let count = 0;
    const maxSpins = 20; // 動畫跳動次數
    const speed = 100;   // 跳動速度 (ms)

    const interval = setInterval(() => {
      // 隨機產生暫時的圖案
      const tempReels = [
        ITEMS[Math.floor(Math.random() * ITEMS.length)],
        ITEMS[Math.floor(Math.random() * ITEMS.length)],
        ITEMS[Math.floor(Math.random() * ITEMS.length)],
      ];
      setReels(tempReels);
      count++;

      if (count >= maxSpins) {
        clearInterval(interval);
        finalizeResult();
      }
    }, speed);
  };

  // 結算結果
  const finalizeResult = () => {
    const finalReels = [
      ITEMS[Math.floor(Math.random() * ITEMS.length)],
      ITEMS[Math.floor(Math.random() * ITEMS.length)],
      ITEMS[Math.floor(Math.random() * ITEMS.length)],
    ];
    setReels(finalReels);
    setIsSpinning(false);

    // 判斷輸贏 (這裡示範簡單的邏輯：三個一樣就中獎)
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      setMessage('🎉 恭喜中大獎！ 🎉');
      triggerConfetti();
    } else {
      setMessage('再接再厲！');
    }
  };

  // 施放煙火特效
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 截圖功能
  const saveTicket = async () => {
    if (ticketRef.current === null) return;
    
    try {
      // 轉換成圖片網址
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true });
      
      // 建立下載連結
      const link = document.createElement('a');
      link.download = `lucky-draw-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('截圖失敗:', err);
      alert('截圖失敗，請稍後再試');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* --- 這一塊是會被截圖的區域 (Ticket Area) --- */}
      <div 
        ref={ticketRef} 
        className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border-8 border-yellow-400 relative overflow-hidden"
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-wider">LUCKY DRAW</h1>
          <p className="text-sm text-slate-500">公司專屬抽獎機</p>
        </div>

        {/* 拉霸視窗 */}
        <div className="flex justify-between bg-slate-100 p-4 rounded-xl border-inner mb-6 shadow-inner">
          {reels.map((item, index) => (
            <div key={index} className="w-20 h-24 bg-white rounded-lg flex items-center justify-center text-5xl shadow-sm border border-slate-200">
              {item}
            </div>
          ))}
        </div>

        {/* 結果訊息 */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="font-bold text-yellow-700 text-lg">{message}</p>
          <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleString()}</p>
        </div>
        
        {/* 裝飾圓點 (模擬票券質感) */}
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
      </div>
      {/* --- 截圖區域結束 --- */}

      {/* 控制按鈕區 (這區不會被截圖) */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 rounded-full text-xl shadow-lg transform active:scale-95 transition-all disabled:opacity-50"
        >
          {isSpinning ? '轉動中...' : '開始拉霸 (SPIN)'}
        </button>

        <button
          onClick={saveTicket}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>📸</span> 保存結果截圖
        </button>
      </div>
    </div>
  );
}
