'use client';

import { useState } from 'react';
import { ScriptForm } from '../components/ScriptForm';
import { ScriptPreview } from '../components/ScriptPreview';
import { ScriptData } from '../types/script';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('glm-4');

  const handleGenerate = async (data: any) => {
    setLoading(true);
    setModel(data.model);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setScriptData(result.data);
      } else {
        alert(result.error || '生成失败');
      }
    } catch (error: any) {
      alert(error.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (data: {
    scriptData: ScriptData;
    sceneNumber?: number;
    reason: string;
    direction?: string;
  }) => {
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          ...data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setScriptData(result.data);
      } else {
        alert(result.error || '重新生成失败');
      }
    } catch (error: any) {
      alert(error.message || '重新生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNewScript = () => {
    setScriptData(null);
  };

  return (
    <main className="min-h-screen">
      {/* 头部 */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Script Generator</h1>
            <p className="text-sm text-muted-foreground">AI 驱动的 Vlog 脚本生成器</p>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        {!scriptData ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                快速生成专业 Vlog 脚本
              </h2>
              <p className="text-muted-foreground">
                输入你的主题和风格偏好，AI 将为你创作完整的 Vlog 脚本
              </p>
            </div>

            <ScriptForm onSubmit={handleGenerate} loading={loading} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ScriptPreview
              scriptData={scriptData}
              onRegenerate={handleRegenerate}
              onNewScript={handleNewScript}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by AI • 支持 GLM-4、DeepSeek-V3 等模型</p>
        </div>
      </footer>
    </main>
  );
}
