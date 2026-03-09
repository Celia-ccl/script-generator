// AI 模型类型
export type AIModel = 'glm-4' | 'deepseek-v3' | 'gpt-4';

// 模型配置
export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
  enabled: boolean;
}

// 口播风格
export type SpeakingStyle = 'daily' | 'funny' | 'healing';

// 主题类型
export type VlogTheme = 'work' | 'weekend' | 'food' | 'travel' | 'lifestyle' | 'custom';

// 输入表单数据
export interface ScriptInput {
  theme: VlogTheme;
  customTheme?: string;
  style: SpeakingStyle;
  duration: number; // 秒
  notes?: string;
  files?: File[];
  selectedDirection?: string;
}

// 内容植入方向
export interface ContentDirection {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

// 脚本片段
export interface ScriptScene {
  sceneNumber: number;
  shotType: 'wide' | 'medium' | 'close-up'; // 远、中、近
  duration: number; // 秒
  content: string; // 镜头内容
  narration: string; // 口播文案
  notes?: string; // 备注
}

// 脚本数据
export interface ScriptData {
  bloggerId: string;
  profileUrl: string;
  productName?: string;
  title: string;
  postContent: string;
  tags: string[];
  totalDuration: number;
  coverImage?: string;
  preview: string; // 开场文案
  scenes: ScriptScene[];
  ending: string; // 结束文案
}

// 文件解析结果
export interface FileParseResult {
  fileName: string;
  fileType: string;
  text: string;
  extractedContent?: string;
}

// API 响应
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 脚本生成请求
export interface GenerateScriptRequest extends ScriptInput {
  model: AIModel;
  bloggerId?: string;
  profileUrl?: string;
}

// 脚本重新生成请求
export interface RegenerateScriptRequest {
  scriptId: string;
  sceneNumber?: number;
  reason: string;
  direction?: string;
}
