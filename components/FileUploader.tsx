import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number; // MB
}

export function FileUploader({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 10,
}: FileUploaderProps) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onFileSelect(file);
    } catch (err: any) {
      setError(err.message || '文件上传失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onFileRemove();
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/5 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
          ) : (
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {loading ? '上传中...' : '点击上传文件'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            支持图片、PDF、Word 文档（最大 {maxSize}MB）
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-input">
          <FileText className="w-5 h-5 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
