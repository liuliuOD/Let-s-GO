// app/constants.ts

export type SlotCategory = {
    id: string;
    label: string;
    items: string[];
    colorClass: string;
};

export const UI_TEXT = {
    TITLE: "來找點事做吧",
    SUBTITLE: "今天要做點什麼",
    SAVE_BUTTON: "📸 保存任務存根",
    SPIN_START: "PUSH",
    SPIN_STOP: "STOP",
    HINT: "點擊下方按鈕開始！",
    ROLLING: "🎲 命運安排中...",
    GO: "✨ 任務鎖定！出發吧！ ✨",
};

export const SLOT_CONFIG: SlotCategory[] = [
    {
        id: "direction",
        label: "方向",
        items: ["南下", "北上",],
        colorClass: "text-blue-600",
    },
    {
        id: "stops",
        label: "站數",
        // 3 ~ 10 站
        items: Array.from({ length: 8 }, (_, i) => `${i + 3} 站`),
        colorClass: "text-red-500",
    },
    {
        id: "tasks",
        label: "任務",
        items: [
            "買咖啡", "拍合照", "吃美食", "深蹲 5 下", "喝飲料",
            "原地解散", "開合跳 10 下", "和路人微笑點頭", "拍街景照",
            "買小零食", "自拍鬼臉", "旋轉 3 圈", "大口喝水",
        ],
        colorClass: "text-slate-800",
    }
];