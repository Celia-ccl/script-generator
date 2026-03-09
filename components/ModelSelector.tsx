import { useState, useEffect } from 'react';
import { Select } from './ui/select';
import { ModelConfig } from '@/types/script';
import { Cpu } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取可用的模型列表
    async function fetchModels() {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        if (data.success) {
          setModels(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Cpu className="w-4 h-4 animate-spin" />
        加载模型...
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <Cpu className="w-4 h-4" />
        无可用模型，请配置 API Key
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Cpu className="w-4 h-4 text-primary" />
      <Select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-40"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
