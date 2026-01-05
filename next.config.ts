/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 1. 強制輸出靜態 HTML
  images: {
    unoptimized: true, // 2. GitHub Pages 不支援 Next.js 內建的圖片優化 Server
  },
  // 3. 如果你的 GitHub Repo 名稱不是你的帳號名 (username.github.io)，
  // 而是像 "my-slot-machine"，請取消下面這行的註解並填入 repo 名稱：
  basePath: '/let-s-go',
};

export default nextConfig;
