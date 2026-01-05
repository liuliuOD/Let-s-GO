"use client";

import { useEffect, useRef } from 'react';

export default function Giscus() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 建立 script 標籤並設定你提供的參數
        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", "liuliuOD/Let-s-GO");
        script.setAttribute("data-repo-id", "R_kgDOQ0FdQA");
        script.setAttribute("data-category", "Announcements");
        script.setAttribute("data-category-id", "DIC_kwDOQ0FdQM4C0mlr");
        script.setAttribute("data-mapping", "url");
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "bottom");
        // 這裡我幫你改成 dark 以配合你的深藍色背景
        script.setAttribute("data-theme", "dark");
        // 這裡改成 zh-TW 讓留言板顯示繁體中文
        script.setAttribute("data-lang", "zh-TW");
        script.crossOrigin = "anonymous";
        script.async = true;

        // 清空舊的內容並加入新的 script
        if (ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(script);
        }
    }, []);

    return (
        <div className="w-full max-w-md mt-12 px-2">
            <div className="border-t border-slate-700 pt-8 mb-4">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest text-center">
                    💬 任務回報留言板
                </h3>
            </div>
            <div ref={ref} />
        </div>
    );
}
