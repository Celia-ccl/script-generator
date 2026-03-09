import { AIModel, GenerateScriptRequest, ScriptData, ContentDirection } from '../../types/script';

/**
 * AI 服务基类
 * 所有 AI 模型实现都应该继承这个类
 */
export abstract class AIService {
  protected apiKey: string;
  protected modelId: AIModel;

  constructor(apiKey: string, modelId: AIModel) {
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  /**
   * 获取模型 ID
   */
  getModelId(): AIModel {
    return this.modelId;
  }

  /**
   * 解析文件内容，提取 brief
   */
  abstract parseBrief(fileText: string): Promise<{
    extractedContent: string;
    suggestions: ContentDirection[];
  }>;

  /**
   * 生成脚本
   */
  abstract generateScript(request: GenerateScriptRequest, selectedDirection: string): Promise<ScriptData>;

  /**
   * 重新生成脚本（部分或全部）
   */
  abstract regenerateScript(
    scriptData: ScriptData,
    sceneNumber?: number,
    reason?: string,
    direction?: string
  ): Promise<ScriptData>;

  /**
   * 测试连接
   */
  abstract testConnection(): Promise<boolean>;
}

/**
 * AI 服务工厂
 * 用于创建不同模型的 AI 服务实例
 */
export class AIServiceFactory {
  private static services: Map<AIModel, new (apiKey: string) => AIService> = new Map();

  /**
   * 注册 AI 服务
   */
  static registerService(modelId: AIModel, serviceClass: new (apiKey: string) => AIService): void {
    this.services.set(modelId, serviceClass);
  }

  /**
   * 创建 AI 服务实例
   */
  static createService(modelId: AIModel, apiKey: string): AIService {
    const ServiceClass = this.services.get(modelId);
    if (!ServiceClass) {
      throw new Error(`Unsupported model: ${modelId}`);
    }
    return new ServiceClass(apiKey);
  }

  /**
   * 获取所有支持的模型
   */
  static getSupportedModels(): AIModel[] {
    return Array.from(this.services.keys());
  }
}
