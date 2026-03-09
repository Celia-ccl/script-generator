import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Script Generator - AI Vlog 脚本生成器",
  description: "AI驱动的Vlog脚本生成工具，帮助内容创作者快速创作专业脚本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {children}
      </body>
    </html>
  );
}
