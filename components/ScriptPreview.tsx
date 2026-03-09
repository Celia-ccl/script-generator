import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { ScriptData, ScriptScene } from '../types/script';
import { ExcelExporter } from '../lib/file/excel-exporter';
import {
  Download,
  RefreshCw,
  Copy,
  Check,
  Clock,
  FileText,
  X,
  Edit3,
} from 'lucide-react';

interface ScriptPreviewProps {
  scriptData: ScriptData;
  onRegenerate?: (data: {
    scriptData: ScriptData;
    sceneNumber?: number;
    reason: string;
    direction?: string;
  }) => void;
  onNewScript?: () => void;
  loading?: boolean;
}

export function ScriptPreview({
  scriptData,
  onRegenerate,
  onNewScript,
  loading = false,
}: ScriptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [editingScene, setEditingScene] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [regenReason, setRegenReason] = useState('');
  const [regenDirection, setRegenDirection] = useState('');
  const [showRegenForm, setShowRegenForm] = useState(false);

  const handleExportExcel = () => {
    ExcelExporter.exportScript(scriptData);
  };

  const handleCopy = () => {
    const text = `${scriptData.title}\n\n${scriptData.postContent}\n\n${scriptData.preview}\n\n${scriptData.scenes
      .map((s) => `【${s.sceneNumber}】${s.content}\n口播：${s.narration}`)
      .join('\n\n')}\n\n${scriptData.ending}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditScene = (sceneNumber: number) => {
    const scene = scriptData.scenes.find((s) => s.sceneNumber === sceneNumber);
    if (scene) {
      setEditingScene(sceneNumber);
      setEditedContent(scene.narration);
    }
  };

  const handleSaveEdit = () => {
    // 这里可以添加保存编辑的逻辑
    setEditingScene(null);
    setEditedContent('');
  };

  const handleRegenerate = (sceneNumber?: number) => {
    if (onRegenerate) {
      onRegenerate({
        scriptData,
        sceneNumber,
        reason: regenReason,
        direction: regenDirection || undefined,
      });
      setShowRegenForm(false);
      setRegenReason('');
      setRegenDirection('');
    }
  };

  const getShotTypeLabel = (shotType: string) => {
    const labels: Record<string, string> = {
      wide: '远景',
      medium: '中景',
      'close-up': '近景',
    };
    return labels[shotType] || shotType;
  };

  const totalDuration = scriptData.scenes.reduce(
    (total, scene) => total + scene.duration,
    0
  );

  return (
    <div className="space-y-4">
      {/* 操作按钮 */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleExportExcel} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          导出 Excel
        </Button>
        <Button onClick={handleCopy} variant="outline" size="sm">
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? '已复制' : '复制脚本'}
        </Button>
        <Button
          onClick={() => setShowRegenForm(!showRegenForm)}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          重新生成
        </Button>
        {onNewScript && (
          <Button onClick={onNewScript} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            新建脚本
          </Button>
        )}
      </div>

      {/* 重新生成表单 */}
      {showRegenForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">重新生成脚本</CardTitle>
            <CardDescription>
              告诉 AI 什么地方需要改进
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regenReason">不满意的原因</Label>
              <Textarea
                id="regenReason"
                placeholder="例如：口播不够有趣、场景描述不够详细..."
                value={regenReason}
                onChange={(e) => setRegenReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regenDirection">改进方向（可选）</Label>
              <Textarea
                id="regenDirection"
                placeholder="例如：希望更幽默一点、增加更多互动..."
                value={regenDirection}
                onChange={(e) => setRegenDirection(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleRegenerate()} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? '生成中...' : '重新生成整个脚本'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRegenForm(false)}
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 脚本基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {scriptData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">博主 ID</p>
              <p className="font-medium">{scriptData.bloggerId || '未提供'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">主页链接</p>
              <p className="font-medium">{scriptData.profileUrl || '未提供'}</p>
            </div>
            {scriptData.productName && (
              <div>
                <p className="text-muted-foreground">合作产品</p>
                <p className="font-medium">{scriptData.productName}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                预计时长
              </p>
              <p className="font-medium">{totalDuration}秒</p>
            </div>
          </div>

          {scriptData.coverImage && (
            <div className="space-y-2">
              <Label>封面图片</Label>
              <img
                src={scriptData.coverImage}
                alt="封面"
                className="w-48 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 发布文案和标签 */}
      <Card>
        <CardHeader>
          <CardTitle>发布文案</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{scriptData.postContent}</p>
          <div className="flex flex-wrap gap-2">
            {scriptData.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 开场文案 */}
      <Card>
        <CardHeader>
          <CardTitle>开场文案</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{scriptData.preview}</p>
        </CardContent>
      </Card>

      {/* 脚本正文 */}
      <Card>
        <CardHeader>
          <CardTitle>脚本正文</CardTitle>
          <CardDescription>
            镜号、景别、时长、镜头内容、口播文案
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scriptData.scenes.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      #{scene.sceneNumber}
                    </span>
                    <span className="text-sm px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {getShotTypeLabel(scene.shotType)}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {scene.duration}秒
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingScene(scene.sceneNumber)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">镜头内容</p>
                    <p className="text-sm">{scene.content}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">口播文案</p>
                    <p className="text-sm">{scene.narration}</p>
                  </div>
                </div>

                {scene.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">备注</p>
                    <p className="text-sm text-muted-foreground">{scene.notes}</p>
                  </div>
                )}

                {/* 单独重新生成按钮 */}
                <div className="mt-3 pt-3 border-t flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate(scene.sceneNumber)}
                    disabled={loading}
                  >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    重新生成此片段
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 结束文案 */}
      <Card>
        <CardHeader>
          <CardTitle>结束文案</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{scriptData.ending}</p>
        </CardContent>
      </Card>
    </div>
  );
}
