import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ModelSelector } from './ModelSelector';
import { FileUploader } from './FileUploader';
import { ContentDirection, VlogTheme, SpeakingStyle, FileParseResult } from '../types/script';
import { Loader2, Sparkles, FileText } from 'lucide-react';

interface ScriptFormProps {
  onSubmit: (data: {
    model: string;
    theme: VlogTheme;
    customTheme: string;
    style: SpeakingStyle;
    duration: number;
    notes: string;
    bloggerId: string;
    profileUrl: string;
    selectedDirection: string;
  }) => void;
  loading?: boolean;
}

export function ScriptForm({ onSubmit, loading = false }: ScriptFormProps) {
  const [model, setModel] = useState('glm-4');
  const [theme, setTheme] = useState<VlogTheme>('work');
  const [customTheme, setCustomTheme] = useState('');
  const [style, setStyle] = useState<SpeakingStyle>('daily');
  const [duration, setDuration] = useState(90);
  const [notes, setNotes] = useState('');
  const [bloggerId, setBloggerId] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResult, setFileResult] = useState<FileParseResult | null>(null);
  const [suggestions, setSuggestions] = useState<ContentDirection[]>([]);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [parsingFile, setParsingFile] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setParsingFile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', model);

      const response = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFileResult(data.data.file);
        setSuggestions(data.data.suggestions);
        setSelectedDirection('');
      } else {
        throw new Error(data.error || '解析失败');
      }
    } catch (error: any) {
      alert(error.message || '文件解析失败');
    } finally {
      setParsingFile(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileResult(null);
    setSuggestions([]);
    setSelectedDirection('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fileResult && !selectedDirection) {
      alert('请选择一个内容植入方向');
      return;
    }

    onSubmit({
      model,
      theme,
      customTheme,
      style,
      duration,
      notes,
      bloggerId,
      profileUrl,
      selectedDirection: fileResult?.text || selectedDirection || '无',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>脚本生成配置</CardTitle>
            <CardDescription>填写信息，AI 将为您生成专业 Vlog 脚本</CardDescription>
          </div>
          <ModelSelector selectedModel={model} onModelChange={setModel} />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">基本信息</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloggerId">博主 ID</Label>
                <Input
                  id="bloggerId"
                  placeholder="你的社媒 ID"
                  value={bloggerId}
                  onChange={(e) => setBloggerId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileUrl">主页链接</Label>
                <Input
                  id="profileUrl"
                  placeholder="https://..."
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Vlog 内容 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Vlog 内容</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">主题</Label>
                <Select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as VlogTheme)}
                >
                  <option value="work">深圳打工人 Vlog</option>
                  <option value="weekend">周末 Vlog</option>
                  <option value="food">逛吃 Vlog</option>
                  <option value="travel">首尔旅行 Vlog</option>
                  <option value="lifestyle">生活方式 Vlog</option>
                  <option value="custom">自定义主题</option>
                </Select>
              </div>

              {theme === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customTheme">自定义主题</Label>
                  <Input
                    id="customTheme"
                    placeholder="输入自定义主题"
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="style">口播风格</Label>
                <Select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as SpeakingStyle)}
                >
                  <option value="daily">日常生活</option>
                  <option value="funny">搞怪抽象</option>
                  <option value="healing">治愈疗愈</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">预计时长（秒）</Label>
                <Input
                  id="duration"
                  type="number"
                  min="30"
                  max="300"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* 文件上传和 Brief 解析 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Brief 文档（可选）</h3>

            <FileUploader
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
            />

            {fileResult && (
              <div className="p-4 bg-accent/50 rounded-lg border border-input">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">文件解析结果</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {fileResult.text.slice(0, 200)}
                      {fileResult.text.length > 200 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-3">
                <Label>选择内容植入方向</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => setSelectedDirection(suggestion.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedDirection === suggestion.id
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium mb-1">{suggestion.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="notes">备注（可选）</Label>
            <Textarea
              id="notes"
              placeholder="例如：对口播的要求、特殊场景等..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || parsingFile}
          >
            {loading || parsingFile ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {parsingFile ? '解析中...' : '生成中...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成脚本
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
